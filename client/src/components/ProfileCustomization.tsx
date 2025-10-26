import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/lib/stores/useAuth';
import { getFirebaseFirestore } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

const AVATARS = ['⛏️', '👨‍🔧', '👩‍🔧', '🧑‍🏭', '👷‍♂️', '👷‍♀️', '🤠', '🥷', '🧙‍♂️', '🧙‍♀️', '🦸‍♂️', '🦸‍♀️'];

interface ProfileCustomizationProps {
  onComplete: () => void;
}

export function ProfileCustomization({ onComplete }: ProfileCustomizationProps) {
  const { t } = useTranslation();
  const { user, profile, setProfile } = useAuth();
  const [displayName, setDisplayName] = useState(profile?.displayName || '');
  const [selectedAvatar, setSelectedAvatar] = useState(profile?.avatar || AVATARS[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (!displayName.trim()) {
      setError('Please enter a name');
      return;
    }

    if (!user) {
      setError('Not authenticated');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const db = getFirebaseFirestore();
      if (!db) throw new Error('Firestore not initialized');

      const playerProfile = {
        uid: user.uid,
        email: user.email || '',
        displayName: displayName.trim(),
        avatar: selectedAvatar,
        createdAt: profile?.createdAt || Date.now(),
        updatedAt: Date.now(),
      };

      await setDoc(doc(db, 'players', user.uid), playerProfile);
      setProfile(playerProfile);
      onComplete();
    } catch (err: any) {
      setError(err.message || 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-yellow-400 via-orange-400 to-red-400">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-red-600 bg-clip-text text-transparent">
            {t('profileTitle')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="displayName">{t('playerName')}</Label>
            <Input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter your name"
              maxLength={20}
              disabled={loading}
            />
          </div>

          <div className="space-y-3">
            <Label>{t('selectAvatar')}</Label>
            <div className="grid grid-cols-6 gap-3">
              {AVATARS.map((avatar) => (
                <button
                  key={avatar}
                  type="button"
                  onClick={() => setSelectedAvatar(avatar)}
                  className={`text-4xl p-3 rounded-xl border-2 transition-all hover:scale-110 ${
                    selectedAvatar === avatar
                      ? 'border-blue-500 bg-blue-50 scale-110 shadow-lg'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  disabled={loading}
                >
                  {avatar}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <Button
            onClick={handleSave}
            className="w-full text-lg py-6"
            size="lg"
            disabled={loading}
          >
            {loading ? t('loading') : t(profile ? 'updateProfile' : 'saveProfile')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
