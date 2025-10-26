import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { initializeFirebase } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

interface FirebaseSetupProps {
  onComplete: () => void;
}

export function FirebaseSetup({ onComplete }: FirebaseSetupProps) {
  const { t } = useTranslation();
  const [config, setConfig] = useState({
    apiKey: '',
    authDomain: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      initializeFirebase(config);
      localStorage.setItem('firebaseConfig', JSON.stringify(config));
      onComplete();
    } catch (err: any) {
      setError(err.message || 'Failed to initialize Firebase');
    }
  };

  const handleChange = (field: string, value: string) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400">
      <Card className="w-full max-w-2xl shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {t('setupTitle')}
          </CardTitle>
          <CardDescription className="text-lg">{t('setupDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apiKey">{t('apiKey')}</Label>
              <Input
                id="apiKey"
                type="text"
                value={config.apiKey}
                onChange={(e) => handleChange('apiKey', e.target.value)}
                required
                className="font-mono text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="authDomain">{t('authDomain')}</Label>
              <Input
                id="authDomain"
                type="text"
                value={config.authDomain}
                onChange={(e) => handleChange('authDomain', e.target.value)}
                required
                className="font-mono text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="projectId">{t('projectId')}</Label>
              <Input
                id="projectId"
                type="text"
                value={config.projectId}
                onChange={(e) => handleChange('projectId', e.target.value)}
                required
                className="font-mono text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="storageBucket">{t('storageBucket')}</Label>
              <Input
                id="storageBucket"
                type="text"
                value={config.storageBucket}
                onChange={(e) => handleChange('storageBucket', e.target.value)}
                required
                className="font-mono text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="messagingSenderId">{t('messagingSenderId')}</Label>
              <Input
                id="messagingSenderId"
                type="text"
                value={config.messagingSenderId}
                onChange={(e) => handleChange('messagingSenderId', e.target.value)}
                required
                className="font-mono text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="appId">{t('appId')}</Label>
              <Input
                id="appId"
                type="text"
                value={config.appId}
                onChange={(e) => handleChange('appId', e.target.value)}
                required
                className="font-mono text-sm"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full text-lg py-6" size="lg">
              {t('initialize')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
