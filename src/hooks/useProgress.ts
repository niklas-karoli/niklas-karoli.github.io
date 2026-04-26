import { useState, useEffect } from 'react';
import type { UserProgress, WorldId } from '../types';

const STORAGE_KEY = 'cyber_academy_progress';

const initialProgress: UserProgress = {
  unlockedWorlds: ['kryptografie'],
  completedWorlds: [],
  currentWorld: 'kryptografie'
};

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse progress', e);
      }
    }
    return initialProgress;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const unlockWorld = (id: WorldId) => {
    setProgress(prev => ({
      ...prev,
      unlockedWorlds: prev.unlockedWorlds.includes(id)
        ? prev.unlockedWorlds
        : [...prev.unlockedWorlds, id]
    }));
  };

  const completeWorld = (id: WorldId) => {
    setProgress(prev => ({
      ...prev,
      completedWorlds: prev.completedWorlds.includes(id)
        ? prev.completedWorlds
        : [...prev.completedWorlds, id]
    }));
  };

  const setCurrentWorld = (id: WorldId) => {
    setProgress(prev => ({
      ...prev,
      currentWorld: id
    }));
  };

  const resetProgress = () => {
    setProgress(initialProgress);
  };

  const unlockAll = () => {
      setProgress({
          unlockedWorlds: ['kryptografie', 'binar', 'fusion', 'python'],
          completedWorlds: [],
          currentWorld: 'kryptografie'
      })
  }

  return {
    progress,
    unlockWorld,
    completeWorld,
    setCurrentWorld,
    resetProgress,
    unlockAll
  };
}
