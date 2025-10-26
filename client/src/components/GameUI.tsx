import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useMiningGame } from '@/lib/stores/useMiningGame';
import { useAuth } from '@/lib/stores/useAuth';
import { MiningCanvas } from './MiningCanvas';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export function GameUI() {
  const { t } = useTranslation();
  const { profile } = useAuth();
  const {
    energy,
    maxEnergy,
    coins,
    pickaxeLevel,
    playerY,
    coal,
    iron,
    gold,
    diamond,
    crystal,
    movePlayer,
    toggleMenu,
    isPlaying,
  } = useMiningGame();

  useEffect(() => {
    if (!isPlaying) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      
      let dx = 0;
      let dy = 0;

      switch (key) {
        case 'w':
        case 'arrowup':
          dy = -1;
          break;
        case 's':
        case 'arrowdown':
          dy = 1;
          break;
        case 'a':
        case 'arrowleft':
          dx = -1;
          break;
        case 'd':
        case 'arrowright':
          dx = 1;
          break;
        case 'escape':
          toggleMenu();
          return;
        default:
          return;
      }

      if (dx !== 0 || dy !== 0) {
        e.preventDefault();
        movePlayer(dx, dy);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, movePlayer, toggleMenu]);

  const energyPercent = (energy / maxEnergy) * 100;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-amber-100 via-orange-50 to-yellow-100 p-4">
      <div className="max-w-7xl mx-auto space-y-4">
        <Card className="p-4 bg-white/90 backdrop-blur shadow-lg">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{profile?.avatar || '⛏️'}</span>
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  {profile?.displayName || 'Miner'}
                </h2>
                <p className="text-sm text-gray-600">
                  {t('depth')}: {playerY}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-2xl font-bold text-yellow-600">
                  💰 {coins}
                </p>
                <p className="text-xs text-gray-600">{t('coins')}</p>
              </div>

              <div className="text-right">
                <p className="text-lg font-semibold text-blue-600">
                  ⛏️ Lv.{pickaxeLevel}
                </p>
                <p className="text-xs text-gray-600">{t('pickaxeLevel')}</p>
              </div>

              <Button onClick={toggleMenu} variant="outline" className="ml-2">
                {t('menu')}
              </Button>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">{t('energy')}</span>
              <span className="font-bold">{energy} / {maxEnergy}</span>
            </div>
            <Progress 
              value={energyPercent} 
              className="h-3"
            />
          </div>

          <div className="mt-4 grid grid-cols-5 gap-2 text-center">
            <div className="bg-gray-100 rounded-lg p-2">
              <div className="text-2xl">⚫</div>
              <div className="text-xs font-semibold mt-1">{coal}</div>
              <div className="text-xs text-gray-600">{t('coal')}</div>
            </div>
            <div className="bg-gray-100 rounded-lg p-2">
              <div className="text-2xl">⚪</div>
              <div className="text-xs font-semibold mt-1">{iron}</div>
              <div className="text-xs text-gray-600">{t('iron')}</div>
            </div>
            <div className="bg-yellow-100 rounded-lg p-2">
              <div className="text-2xl">🟡</div>
              <div className="text-xs font-semibold mt-1">{gold}</div>
              <div className="text-xs text-gray-600">{t('gold')}</div>
            </div>
            <div className="bg-blue-100 rounded-lg p-2">
              <div className="text-2xl">💎</div>
              <div className="text-xs font-semibold mt-1">{diamond}</div>
              <div className="text-xs text-gray-600">{t('diamond')}</div>
            </div>
            <div className="bg-purple-100 rounded-lg p-2">
              <div className="text-2xl">✨</div>
              <div className="text-xs font-semibold mt-1">{crystal}</div>
              <div className="text-xs text-gray-600">{t('crystal')}</div>
            </div>
          </div>
        </Card>

        <div className="bg-white rounded-lg shadow-lg p-4 overflow-auto" style={{ maxHeight: '60vh' }}>
          <MiningCanvas />
        </div>

        <Card className="p-4 bg-white/90 backdrop-blur">
          <p className="text-center text-sm text-gray-600">
            {t('helpMovement')} • ESC for {t('menu')}
          </p>
          {energy === 0 && (
            <div className="mt-2 p-3 bg-red-50 border-2 border-red-200 rounded-lg text-center">
              <p className="text-red-700 font-bold">{t('gameOver')}</p>
              <Button onClick={toggleMenu} className="mt-2">
                {t('returnToMenu')}
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
