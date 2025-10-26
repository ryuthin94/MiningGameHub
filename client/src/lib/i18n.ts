import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      // Firebase Setup
      "setupTitle": "Setup Firebase",
      "setupDescription": "Enter your Firebase configuration to get started",
      "apiKey": "API Key",
      "authDomain": "Auth Domain",
      "projectId": "Project ID",
      "storageBucket": "Storage Bucket",
      "messagingSenderId": "Messaging Sender ID",
      "appId": "App ID",
      "initialize": "Initialize Game",
      "loading": "Loading...",
      
      // Auth
      "login": "Login",
      "register": "Register",
      "logout": "Logout",
      "email": "Email",
      "password": "Password",
      "loginTitle": "Login to Play",
      "registerTitle": "Create Account",
      "noAccount": "Don't have an account?",
      "haveAccount": "Already have an account?",
      "switchToRegister": "Register here",
      "switchToLogin": "Login here",
      
      // Profile
      "profileTitle": "Customize Profile",
      "playerName": "Player Name",
      "selectAvatar": "Select Avatar",
      "saveProfile": "Start Mining!",
      "updateProfile": "Update Profile",
      
      // Game
      "gameTitle": "Ayrton Mining Game",
      "energy": "Energy",
      "coins": "Coins",
      "depth": "Depth",
      "pickaxeLevel": "Pickaxe Level",
      "inventory": "Inventory",
      "coal": "Coal",
      "iron": "Iron",
      "gold": "Gold",
      "diamond": "Diamond",
      "crystal": "Crystal",
      
      // Menu
      "menu": "Menu",
      "newGame": "New Game",
      "continue": "Continue",
      "shop": "Shop",
      "leaderboard": "Leaderboard",
      "help": "Help",
      "settings": "Settings",
      
      // Shop
      "shopTitle": "Shop",
      "upgradePickaxe": "Upgrade Pickaxe",
      "increaseEnergy": "Increase Max Energy",
      "sellOres": "Sell All Ores",
      "cost": "Cost",
      "sell": "Sell",
      "buy": "Buy",
      "notEnoughCoins": "Not enough coins!",
      "purchaseSuccess": "Purchase successful!",
      "soldOres": "Sold ores for",
      
      // Leaderboard
      "leaderboardTitle": "Top Miners",
      "rank": "Rank",
      "player": "Player",
      "score": "Score",
      "topByCoins": "Top by Coins",
      "topByDepth": "Top by Depth",
      "topByRareOres": "Top by Rare Ores",
      
      // Help
      "helpTitle": "How to Play",
      "helpMovement": "Use W/A/S/D or Arrow Keys to move",
      "helpCollect": "Walk over ores to collect them",
      "helpEnergy": "Each move costs 1 energy",
      "helpShop": "Sell ores for coins and upgrade in the shop",
      "helpDepth": "Deeper layers have rarer ores",
      "helpOres": "Ores: Coal (C), Iron (I), Gold (G), Diamond (D), Crystal (X)",
      
      // Settings
      "settingsTitle": "Settings",
      "language": "Language",
      "sound": "Sound",
      "on": "On",
      "off": "Off",
      
      // Game Over
      "gameOver": "Out of Energy!",
      "returnToMenu": "Return to Menu",
      "finalStats": "Final Stats",
      
      // Common
      "close": "Close",
      "back": "Back",
      "confirm": "Confirm",
      "cancel": "Cancel",
      "save": "Save",
      "yes": "Yes",
      "no": "No",
    }
  },
  th: {
    translation: {
      // Firebase Setup
      "setupTitle": "ตั้งค่า Firebase",
      "setupDescription": "ใส่ข้อมูล Firebase เพื่อเริ่มเกม",
      "apiKey": "API Key",
      "authDomain": "Auth Domain",
      "projectId": "Project ID",
      "storageBucket": "Storage Bucket",
      "messagingSenderId": "Messaging Sender ID",
      "appId": "App ID",
      "initialize": "เริ่มเกม",
      "loading": "กำลังโหลด...",
      
      // Auth
      "login": "เข้าสู่ระบบ",
      "register": "สมัครสมาชิก",
      "logout": "ออกจากระบบ",
      "email": "อีเมล",
      "password": "รหัสผ่าน",
      "loginTitle": "เข้าสู่ระบบเพื่อเล่น",
      "registerTitle": "สร้างบัญชี",
      "noAccount": "ยังไม่มีบัญชี?",
      "haveAccount": "มีบัญชีอยู่แล้ว?",
      "switchToRegister": "สมัครที่นี่",
      "switchToLogin": "เข้าสู่ระบบที่นี่",
      
      // Profile
      "profileTitle": "ปรับแต่งโปรไฟล์",
      "playerName": "ชื่อผู้เล่น",
      "selectAvatar": "เลือกอวตาร",
      "saveProfile": "เริ่มขุด!",
      "updateProfile": "อัพเดทโปรไฟล์",
      
      // Game
      "gameTitle": "เกมขุดแร่ของ Ayrton",
      "energy": "พลังงาน",
      "coins": "เหรียญ",
      "depth": "ความลึก",
      "pickaxeLevel": "ระดับอุปกรณ์ขุด",
      "inventory": "กระเป๋า",
      "coal": "ถ่านหิน",
      "iron": "เหล็ก",
      "gold": "ทอง",
      "diamond": "เพชร",
      "crystal": "คริสตัล",
      
      // Menu
      "menu": "เมนู",
      "newGame": "เกมใหม่",
      "continue": "ต่อเกม",
      "shop": "ร้านค้า",
      "leaderboard": "ตารางผู้นำ",
      "help": "วิธีเล่น",
      "settings": "ตั้งค่า",
      
      // Shop
      "shopTitle": "ร้านค้า",
      "upgradePickaxe": "อัพเกรดอุปกรณ์ขุด",
      "increaseEnergy": "เพิ่มพลังงานสูงสุด",
      "sellOres": "ขายแร่ทั้งหมด",
      "cost": "ราคา",
      "sell": "ขาย",
      "buy": "ซื้อ",
      "notEnoughCoins": "เหรียญไม่พอ!",
      "purchaseSuccess": "ซื้อสำเร็จ!",
      "soldOres": "ขายแร่ได้",
      
      // Leaderboard
      "leaderboardTitle": "นักขุดชั้นนำ",
      "rank": "อันดับ",
      "player": "ผู้เล่น",
      "score": "คะแนน",
      "topByCoins": "อันดับเหรียญ",
      "topByDepth": "อันดับความลึก",
      "topByRareOres": "อันดับแร่หายาก",
      
      // Help
      "helpTitle": "วิธีเล่น",
      "helpMovement": "ใช้ W/A/S/D หรือปุ่มลูกศรเพื่อเคลื่อนที่",
      "helpCollect": "เดินผ่านแร่เพื่อเก็บ",
      "helpEnergy": "การเคลื่อนที่แต่ละครั้งใช้พลังงาน 1",
      "helpShop": "ขายแร่เพื่อรับเหรียญและอัพเกรดในร้านค้า",
      "helpDepth": "ชั้นที่ลึกกว่ามีแร่หายากกว่า",
      "helpOres": "แร่: ถ่านหิน (C), เหล็ก (I), ทอง (G), เพชร (D), คริสตัล (X)",
      
      // Settings
      "settingsTitle": "ตั้งค่า",
      "language": "ภาษา",
      "sound": "เสียง",
      "on": "เปิด",
      "off": "ปิด",
      
      // Game Over
      "gameOver": "พลังงานหมด!",
      "returnToMenu": "กลับไปเมนู",
      "finalStats": "สถิติสุดท้าย",
      
      // Common
      "close": "ปิด",
      "back": "กลับ",
      "confirm": "ยืนยัน",
      "cancel": "ยกเลิก",
      "save": "บันทึก",
      "yes": "ใช่",
      "no": "ไม่",
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
