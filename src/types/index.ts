export type WorldId = 'kryptografie' | 'binar' | 'fusion' | 'python';

export interface World {
  id: WorldId;
  title: string;
  description: string;
  status: 'locked' | 'unlocked' | 'completed';
  icon: string;
}

export interface UserProgress {
  unlockedWorlds: WorldId[];
  completedWorlds: WorldId[];
  currentWorld: WorldId;
  stages: Record<WorldId, number>; // Maps world to current stage index
  score: number;
  lastUpdated: number;
}
