import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import type { UserProgress, WorldId } from '../types';

const STORAGE_KEY = 'cyber_academy_progress_v2';
const COOKIE_KEY = 'cyber_academy_progress';

const initialProgress: UserProgress = {
  unlockedWorlds: ['kryptografie'],
  completedWorlds: [],
  currentWorld: 'kryptografie',
  stages: {
    kryptografie: 0,
    binar: 0,
    fusion: 0,
    python: 0
  },
  score: 0,
  lastUpdated: Date.now()
};

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress>(() => {
    let base: UserProgress = initialProgress;

    // 1. Try LocalStorage
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        base = { ...initialProgress, ...parsed };
      } catch (e) {
        console.error('Failed to parse storage progress', e);
      }
    }

    // 2. Try Cookies (Backup)
    const cookieData = Cookies.get(COOKIE_KEY);
    if (cookieData && !saved) {
        try {
            const parsed = JSON.parse(cookieData);
            base = { ...initialProgress, ...parsed };
        } catch (e) {
            console.error('Failed to parse cookie progress', e);
        }
    }

    return base;
  });

  // Persist changes
  useEffect(() => {
    const data = JSON.stringify(progress);
    localStorage.setItem(STORAGE_KEY, data);
    Cookies.set(COOKIE_KEY, data, { expires: 365, sameSite: 'strict' });
  }, [progress]);

  const saveStage = (worldId: WorldId, stage: number) => {
    setProgress(prev => ({
        ...prev,
        stages: { ...prev.stages, [worldId]: stage },
        score: prev.score + 10,
        lastUpdated: Date.now()
    }));
  };

  const unlockWorld = (id: WorldId) => {
    setProgress(prev => ({
      ...prev,
      unlockedWorlds: prev.unlockedWorlds.includes(id)
        ? prev.unlockedWorlds
        : [...prev.unlockedWorlds, id],
      lastUpdated: Date.now()
    }));
  };

  const completeWorld = (id: WorldId) => {
    setProgress(prev => ({
      ...prev,
      completedWorlds: prev.completedWorlds.includes(id)
        ? prev.completedWorlds
        : [...prev.completedWorlds, id],
      score: prev.score + 100,
      lastUpdated: Date.now()
    }));
  };

  const setCurrentWorld = (id: WorldId) => {
    setProgress(prev => ({
      ...prev,
      currentWorld: id
    }));
  };

  const resetProgress = () => {
    if (window.confirm('Möchtest du wirklich deinen gesamten Fortschritt löschen?')) {
        setProgress(initialProgress);
        localStorage.removeItem(STORAGE_KEY);
        Cookies.remove(COOKIE_KEY);
    }
  };

  const unlockAll = () => {
      setProgress({
          ...initialProgress,
          unlockedWorlds: ['kryptografie', 'binar', 'fusion', 'python'],
          completedWorlds: ['kryptografie', 'binar', 'fusion', 'python'],
          score: 5000,
          lastUpdated: Date.now()
      })
  };

  const manualUnlock = (worldId: WorldId) => {
    setProgress(prev => {
        const flow: WorldId[] = ['kryptografie', 'binar', 'fusion', 'python'];
        const idx = flow.indexOf(worldId);
        const unlocked = [...new Set([...prev.unlockedWorlds, ...flow.slice(0, idx + 1)])];
        const completed = [...new Set([...prev.completedWorlds, ...flow.slice(0, idx)])];

        return {
            ...prev,
            unlockedWorlds: unlocked,
            completedWorlds: completed,
            lastUpdated: Date.now()
        };
    });
  };

  return {
    progress,
    saveStage,
    unlockWorld,
    completeWorld,
    setCurrentWorld,
    resetProgress,
    unlockAll,
    manualUnlock
  };
}
