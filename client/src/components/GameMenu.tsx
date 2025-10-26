import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMiningGame } from '@/lib/stores/useMiningGame';
import { useAuth } from '@/lib/stores/useAuth';
import { getFirebaseAuth, getFirebaseFirestore } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function GameMenu() {
  const { t, i18n } = useTranslation();
  const { profile, logout } = useAuth();
  const {
    initGame,
    resumeGame,
    resetGame,
    sellAllOres,
    upgradePickaxe,
    increaseMaxEnergy,
    toggleMenu,
    coal,
    iron,
    gold,
    diamond,
    crystal,
    coins,
    pickaxeLevel,
    isPlaying,
  } = useMiningGame();

  const [showShop, setShowShop] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [message, setMessage] = useState('');
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);

  const handleNewGame = () => {
    if (isPlaying) {
      if (confirm('Start a new game? Current progress will be lost.')) {
        resetGame();
        toggleMenu();
      }
    } else {
      initGame();
      toggleMenu();
    }
  };

  const handleContinue = async () => {
    const { loadFromFirestore } = useMiningGame.getState();
    await loadFromFirestore();
    
    // Check fresh state after loading
    const freshState = useMiningGame.getState();
    if (freshState.isPlaying) {
      resumeGame();
    } else {
      // If no saved game found, start new
      initGame();
    }
  };

  const handleSellOres = () => {
    const value = sellAllOres();
    setMessage(`${t('soldOres')} ${value} ${t('coins')}!`);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleUpgradePickaxe = () => {
    const success = upgradePickaxe();
    if (success) {
      setMessage(t('purchaseSuccess'));
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage(t('notEnoughCoins'));
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleIncreaseEnergy = () => {
    const success = increaseMaxEnergy();
    if (success) {
      setMessage(t('purchaseSuccess'));
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage(t('notEnoughCoins'));
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleLogout = async () => {
    const auth = getFirebaseAuth();
    if (auth) {
      await signOut(auth);
      logout();
    }
  };

  const loadLeaderboard = async () => {
    setLoadingLeaderboard(true);
    try {
      const db = getFirebaseFirestore();
      if (!db) return;

      const q = query(
        collection(db, 'leaderboard'),
        orderBy('coins', 'desc'),
        limit(10)
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => doc.data());
      setLeaderboardData(data);
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
    } finally {
      setLoadingLeaderboard(false);
    }
  };

  const openLeaderboard = () => {
    setShowLeaderboard(true);
    loadLeaderboard();
  };

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  const pickaxeCost = 50 + 30 * (pickaxeLevel - 1);
  const energyCost = 60;
  const totalOreValue = coal * 2 + iron * 5 + gold * 12 + diamond * 40 + crystal * 80;

  return (
    <>
      <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400">
        <Card className="w-full max-w-2xl shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
              {t('gameTitle')}
            </CardTitle>
            {profile && (
              <div className="flex items-center justify-center gap-2 mt-2">
                <span className="text-3xl">{profile.avatar}</span>
                <span className="text-lg font-semibold">{profile.displayName}</span>
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-3">
            {isPlaying && (
              <Button onClick={handleContinue} className="w-full text-lg py-6" size="lg">
                {t('continue')}
              </Button>
            )}
            
            <Button onClick={handleNewGame} variant="outline" className="w-full text-lg py-6" size="lg">
              {t('newGame')}
            </Button>

            <Button onClick={() => setShowShop(true)} variant="outline" className="w-full text-lg py-6" size="lg">
              🛒 {t('shop')}
            </Button>

            <Button onClick={openLeaderboard} variant="outline" className="w-full text-lg py-6" size="lg">
              🏆 {t('leaderboard')}
            </Button>

            <Button onClick={() => setShowHelp(true)} variant="outline" className="w-full text-lg py-6" size="lg">
              ❓ {t('help')}
            </Button>

            <Button onClick={() => setShowSettings(true)} variant="outline" className="w-full text-lg py-6" size="lg">
              ⚙️ {t('settings')}
            </Button>

            <Button onClick={handleLogout} variant="destructive" className="w-full mt-4">
              {t('logout')}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showShop} onOpenChange={setShowShop}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">{t('shopTitle')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-3 bg-yellow-50 rounded-lg text-center">
              <p className="text-2xl font-bold text-yellow-600">💰 {coins} {t('coins')}</p>
            </div>

            <Card className="p-4">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <p className="font-semibold">{t('upgradePickaxe')}</p>
                  <p className="text-sm text-gray-600">Lv.{pickaxeLevel} → Lv.{pickaxeLevel + 1}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">{t('cost')}</p>
                  <p className="font-bold">💰 {pickaxeCost}</p>
                </div>
              </div>
              <Button onClick={handleUpgradePickaxe} className="w-full" disabled={coins < pickaxeCost}>
                {t('buy')}
              </Button>
            </Card>

            <Card className="p-4">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <p className="font-semibold">{t('increaseEnergy')}</p>
                  <p className="text-sm text-gray-600">+20 {t('energy')}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">{t('cost')}</p>
                  <p className="font-bold">💰 {energyCost}</p>
                </div>
              </div>
              <Button onClick={handleIncreaseEnergy} className="w-full" disabled={coins < energyCost}>
                {t('buy')}
              </Button>
            </Card>

            <Card className="p-4 bg-green-50">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <p className="font-semibold">{t('sellOres')}</p>
                  <p className="text-sm text-gray-600">
                    ⚫{coal} ⚪{iron} 🟡{gold} 💎{diamond} ✨{crystal}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">{t('sell')}</p>
                  <p className="font-bold text-green-600">💰 {totalOreValue}</p>
                </div>
              </div>
              <Button onClick={handleSellOres} className="w-full bg-green-600 hover:bg-green-700" disabled={totalOreValue === 0}>
                {t('sell')}
              </Button>
            </Card>

            {message && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-center text-blue-700 font-medium">
                {message}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showLeaderboard} onOpenChange={setShowLeaderboard}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">{t('leaderboardTitle')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {loadingLeaderboard ? (
              <p className="text-center py-8">{t('loading')}</p>
            ) : leaderboardData.length === 0 ? (
              <p className="text-center py-8 text-gray-500">No data yet. Be the first!</p>
            ) : (
              <div className="space-y-2">
                {leaderboardData.map((entry, index) => (
                  <Card key={index} className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold text-gray-400">#{index + 1}</span>
                        <span className="text-2xl">{entry.avatar}</span>
                        <span className="font-semibold">{entry.displayName}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-yellow-600">💰 {entry.coins}</p>
                        <p className="text-sm text-gray-600">{t('depth')}: {entry.maxDepth || 0}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showHelp} onOpenChange={setShowHelp}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">{t('helpTitle')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 text-sm">
            <p>• {t('helpMovement')}</p>
            <p>• {t('helpCollect')}</p>
            <p>• {t('helpEnergy')}</p>
            <p>• {t('helpShop')}</p>
            <p>• {t('helpDepth')}</p>
            <p className="pt-2 border-t">• {t('helpOres')}</p>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">{t('settingsTitle')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="font-semibold mb-2">{t('language')}</p>
              <div className="flex gap-2">
                <Button
                  onClick={() => changeLanguage('en')}
                  variant={i18n.language === 'en' ? 'default' : 'outline'}
                  className="flex-1"
                >
                  English
                </Button>
                <Button
                  onClick={() => changeLanguage('th')}
                  variant={i18n.language === 'th' ? 'default' : 'outline'}
                  className="flex-1"
                >
                  ไทย
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
