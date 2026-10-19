export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'planning' | 'accessibility' | 'technology' | 'pedagogy';
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface TeacherProfile {
  name: string;
  role: string;
  school: string;
  level: number;
  xp: number;
  nextLevelXp: number;
  achievements: Achievement[];
  totalLessonsCreated: number;
  averageClearScore: number;
  accessibilityAuditsPassed: number;
}

export interface SyncStatus {
  isOnline: boolean;
  isSyncing: boolean;
  lastSyncedAt: string | null;
  pendingChangesCount: number;
  storageUsageKb: number;
}
