import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { getFirebaseFirestore, getFirebaseAuth } from '../firebase';
import { doc, setDoc, getDoc, collection, query, orderBy, limit, getDocs } from 'firebase/firestore';

export type OreType = 'coal' | 'iron' | 'gold' | 'diamond' | 'crystal';
export type CellType = ' ' | '#' | 'C' | 'I' | 'G' | 'D' | 'X';

export interface GameState {
  cols: number;
  rows: number;
  playerX: number;
  playerY: number;
  mine: CellType[][];
  
  // Inventory
  coal: number;
  iron: number;
  gold: number;
  diamond: number;
  crystal: number;
  
  // Stats
  coins: number;
  pickaxeLevel: number;
  maxEnergy: number;
  energy: number;
  maxDepthReached: number;
  totalRareOresCollected: number; // Cumulative diamonds + crystals
  
  // Game state
  isPlaying: boolean;
  isPaused: boolean;
  showMenu: boolean;
  
  // Actions
  initGame: () => void;
  movePlayer: (dx: number, dy: number) => boolean;
  collectOre: (row: number, col: number) => void;
  sellAllOres: () => number;
  upgradePickaxe: () => boolean;
  increaseMaxEnergy: () => boolean;
  expandMine: (extraRows: number) => void;
  resetGame: () => void;
  toggleMenu: () => void;
  resumeGame: () => void;
  saveToFirestore: () => Promise<void>;
  loadFromFirestore: () => Promise<void>;
  updateLeaderboard: () => Promise<void>;
}

// Ore generation with depth-based rarity (from C code)
function randomOreForDepth(depthRowIndex: number): CellType {
  const depthFactor = Math.floor(depthRowIndex / 5);
  const r = Math.floor(Math.random() * 1000);

  let stone_th = 600;
  let coal_th = 850;
  let iron_th = 940;
  let gold_th = 985;
  let diamond_th = 998;

  stone_th = Math.max(350, stone_th - depthFactor * 10);
  coal_th = Math.max(stone_th + 50, coal_th - depthFactor * 6);
  iron_th = Math.max(coal_th + 20, iron_th - depthFactor * 4);
  gold_th = Math.max(iron_th + 10, gold_th - depthFactor * 2);
  diamond_th = Math.max(gold_th + 2, diamond_th - depthFactor * 1);

  if (r < stone_th) return '#';
  if (r < coal_th) return 'C';
  if (r < iron_th) return 'I';
  if (r < gold_th) return 'G';
  if (r < diamond_th) return 'D';
  return 'X';
}

function generateMineRows(start: number, end: number, cols: number): CellType[][] {
  const rows: CellType[][] = [];
  for (let i = start; i < end; i++) {
    const row: CellType[] = [];
    for (let j = 0; j < cols; j++) {
      row.push(randomOreForDepth(i));
    }
    rows.push(row);
  }
  return rows;
}

export const useMiningGame = create<GameState>()(
  subscribeWithSelector((set, get) => ({
    cols: 10,
    rows: 15,
    playerX: 4,
    playerY: 0,
    mine: [],
    
    coal: 0,
    iron: 0,
    gold: 0,
    diamond: 0,
    crystal: 0,
    
    coins: 0,
    pickaxeLevel: 1,
    maxEnergy: 100,
    energy: 100,
    maxDepthReached: 0,
    totalRareOresCollected: 0,
    
    isPlaying: false,
    isPaused: false,
    showMenu: true,
    
    initGame: () => {
      const { cols } = get();
      const mine = generateMineRows(0, 15, cols);
      set({
        rows: 15,
        playerX: 4,
        playerY: 0,
        mine,
        coal: 0,
        iron: 0,
        gold: 0,
        diamond: 0,
        crystal: 0,
        coins: 0,
        pickaxeLevel: 1,
        maxEnergy: 100,
        energy: 100,
        maxDepthReached: 0,
        totalRareOresCollected: 0,
        isPlaying: true,
        isPaused: false,
        showMenu: false,
      });
    },
    
    movePlayer: (dx: number, dy: number) => {
      const state = get();
      if (state.energy <= 0 || !state.isPlaying || state.isPaused) return false;
      
      const newX = state.playerX + dx;
      const newY = state.playerY + dy;
      
      if (newX < 0 || newX >= state.cols || newY < 0 || newY >= state.rows) {
        return false;
      }
      
      const cell = state.mine[newY][newX];
      if (cell !== ' ' && cell !== '#') {
        get().collectOre(newY, newX);
      } else if (cell === '#') {
        const newMine = [...state.mine];
        newMine[newY] = [...newMine[newY]];
        newMine[newY][newX] = ' ';
        set({ mine: newMine });
      }
      
      const maxDepthReached = Math.max(state.maxDepthReached, newY);
      
      set({
        playerX: newX,
        playerY: newY,
        energy: state.energy - 1,
        maxDepthReached,
      });
      
      // Auto-save every 10 moves
      if ((state.energy - 1) % 10 === 0) {
        get().saveToFirestore();
      }
      
      // Auto-expand if near bottom
      if (newY >= state.rows - 5 && state.rows < 200) {
        get().expandMine(10);
      }
      
      return true;
    },
    
    collectOre: (row: number, col: number) => {
      const state = get();
      const oreType = state.mine[row][col];
      
      const updates: any = {};
      let rareOreBonus = 0;
      
      switch (oreType) {
        case 'C': updates.coal = state.coal + 1; break;
        case 'I': updates.iron = state.iron + 1; break;
        case 'G': updates.gold = state.gold + 1; break;
        case 'D': 
          updates.diamond = state.diamond + 1;
          rareOreBonus = 1;
          break;
        case 'X': 
          updates.crystal = state.crystal + 1;
          rareOreBonus = 1;
          break;
      }
      
      const newMine = [...state.mine];
      newMine[row] = [...newMine[row]];
      newMine[row][col] = ' ';
      
      set({ 
        ...updates, 
        mine: newMine,
        totalRareOresCollected: state.totalRareOresCollected + rareOreBonus
      });
    },
    
    sellAllOres: () => {
      const state = get();
      const value = 
        state.coal * 2 + 
        state.iron * 5 + 
        state.gold * 12 + 
        state.diamond * 40 + 
        state.crystal * 80;
      
      // Update coins FIRST so leaderboard gets the correct balance
      set({
        coins: state.coins + value,
        coal: 0,
        iron: 0,
        gold: 0,
        diamond: 0,
        crystal: 0,
      });
      
      // Update leaderboard after coins are updated (rare ores tracked cumulatively)
      get().updateLeaderboard();
      
      // Save after selling
      get().saveToFirestore();
      
      return value;
    },
    
    upgradePickaxe: () => {
      const state = get();
      const cost = 50 + 30 * (state.pickaxeLevel - 1);
      
      if (state.coins >= cost) {
        set({
          coins: state.coins - cost,
          pickaxeLevel: state.pickaxeLevel + 1,
        });
        get().saveToFirestore();
        return true;
      }
      return false;
    },
    
    increaseMaxEnergy: () => {
      const state = get();
      const cost = 60;
      
      if (state.coins >= cost) {
        set({
          coins: state.coins - cost,
          maxEnergy: state.maxEnergy + 20,
          energy: state.energy + 20,
        });
        get().saveToFirestore();
        return true;
      }
      return false;
    },
    
    expandMine: (extraRows: number) => {
      const state = get();
      const newRows = Math.min(state.rows + extraRows, 200);
      const newMineRows = generateMineRows(state.rows, newRows, state.cols);
      
      set({
        rows: newRows,
        mine: [...state.mine, ...newMineRows],
      });
    },
    
    resetGame: () => {
      get().initGame();
    },
    
    toggleMenu: () => {
      const state = get();
      // Save before opening menu
      if (!state.showMenu) {
        get().saveToFirestore();
      }
      set({
        isPaused: !state.isPaused,
        showMenu: !state.showMenu,
      });
    },
    
    resumeGame: () => {
      set({
        isPaused: false,
        showMenu: false,
      });
    },
    
    saveToFirestore: async () => {
      try {
        const auth = getFirebaseAuth();
        const db = getFirebaseFirestore();
        
        if (!auth?.currentUser || !db) return;
        
        const state = get();
        const gameData = {
          cols: state.cols,
          rows: state.rows,
          playerX: state.playerX,
          playerY: state.playerY,
          mine: state.mine,
          coal: state.coal,
          iron: state.iron,
          gold: state.gold,
          diamond: state.diamond,
          crystal: state.crystal,
          coins: state.coins,
          pickaxeLevel: state.pickaxeLevel,
          maxEnergy: state.maxEnergy,
          energy: state.energy,
          maxDepthReached: state.maxDepthReached,
          totalRareOresCollected: state.totalRareOresCollected,
          lastSaved: Date.now(),
        };
        
        await setDoc(doc(db, 'gameState', auth.currentUser.uid), gameData);
        console.log('Game saved to Firestore');
      } catch (error) {
        console.error('Failed to save game:', error);
      }
    },
    
    loadFromFirestore: async () => {
      try {
        const auth = getFirebaseAuth();
        const db = getFirebaseFirestore();
        
        if (!auth?.currentUser || !db) return;
        
        const docSnap = await getDoc(doc(db, 'gameState', auth.currentUser.uid));
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          set({
            cols: data.cols,
            rows: data.rows,
            playerX: data.playerX,
            playerY: data.playerY,
            mine: data.mine,
            coal: data.coal,
            iron: data.iron,
            gold: data.gold,
            diamond: data.diamond,
            crystal: data.crystal,
            coins: data.coins,
            pickaxeLevel: data.pickaxeLevel,
            maxEnergy: data.maxEnergy,
            energy: data.energy,
            maxDepthReached: data.maxDepthReached || 0,
            totalRareOresCollected: data.totalRareOresCollected || 0,
            isPlaying: true,
            isPaused: false,
            showMenu: false,
          });
          console.log('Game loaded from Firestore');
        }
      } catch (error) {
        console.error('Failed to load game:', error);
      }
    },
    
    updateLeaderboard: async () => {
      try {
        const auth = getFirebaseAuth();
        const db = getFirebaseFirestore();
        
        if (!auth?.currentUser || !db) return;
        
        // Get player profile for display name and avatar
        const profileDoc = await getDoc(doc(db, 'players', auth.currentUser.uid));
        if (!profileDoc.exists()) return;
        
        const profile = profileDoc.data();
        const state = get();
        
        // Use cumulative rare ores collected instead of current inventory
        const leaderboardEntry = {
          uid: auth.currentUser.uid,
          displayName: profile.displayName,
          avatar: profile.avatar,
          coins: state.coins,
          maxDepth: state.maxDepthReached,
          rareOres: state.totalRareOresCollected,
          pickaxeLevel: state.pickaxeLevel,
          updatedAt: Date.now(),
        };
        
        await setDoc(doc(db, 'leaderboard', auth.currentUser.uid), leaderboardEntry);
        console.log('Leaderboard updated');
      } catch (error) {
        console.error('Failed to update leaderboard:', error);
      }
    },
  }))
);
