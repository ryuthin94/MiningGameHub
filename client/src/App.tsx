import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { initializeFirebase, getFirebaseAuth, getFirebaseFirestore, isFirebaseInitialized } from '@/lib/firebase';
import { useAuth } from '@/lib/stores/useAuth';
import { useMiningGame } from '@/lib/stores/useMiningGame';
import { AuthScreen } from '@/components/AuthScreen';
import { ProfileCustomization } from '@/components/ProfileCustomization';
import { GameUI } from '@/components/GameUI';
import { GameMenu } from '@/components/GameMenu';
import '@/lib/i18n';
import '@fontsource/inter';

function App() {
  const { i18n } = useTranslation();
  const { user, profile, setUser, setProfile, setLoading } = useAuth();
  const { isPlaying, showMenu } = useMiningGame();
  const [needsProfile, setNeedsProfile] = useState(false);

  // Initialize Firebase on app start
  useEffect(() => {
    try {
      initializeFirebase();
    } catch (error) {
      console.error('Failed to initialize Firebase:', error);
    }
  }, []);

  useEffect(() => {
    if (!isFirebaseInitialized()) return;

    const auth = getFirebaseAuth();
    if (!auth) return;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);

      if (firebaseUser) {
        const db = getFirebaseFirestore();
        if (db) {
          try {
            const profileDoc = await getDoc(doc(db, 'players', firebaseUser.uid));
            if (profileDoc.exists()) {
              setProfile(profileDoc.data() as any);
              setNeedsProfile(false);
              
              // Try to load saved game
              const { useMiningGame } = await import('@/lib/stores/useMiningGame');
              await useMiningGame.getState().loadFromFirestore();
            } else {
              setNeedsProfile(true);
            }
          } catch (error) {
            console.error('Failed to load profile:', error);
            setNeedsProfile(true);
          }
        }
      } else {
        setProfile(null);
        setNeedsProfile(false);
      }
    });

    return () => unsubscribe();
  }, [setUser, setProfile, setLoading]);

  if (!user) {
    return <AuthScreen />;
  }

  if (needsProfile || !profile) {
    return <ProfileCustomization onComplete={() => setNeedsProfile(false)} />;
  }

  if (showMenu || !isPlaying) {
    return <GameMenu />;
  }

  return <GameUI />;
}

export default App;
