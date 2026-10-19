import React, { useState, useEffect } from 'react';
import { 
  X, 
  Award, 
  ShieldCheck, 
  Trophy, 
  Sparkles, 
  Cloud, 
  CloudOff, 
  RefreshCw, 
  Check, 
  Download, 
  ChevronRight, 
  Zap, 
  Star,
  CheckCircle2,
  Lock,
  Layers
} from 'lucide-react';
import { Achievement, TeacherProfile, SyncStatus } from '../types/achievement';
import { syncManager } from '../utils/dataSyncManager';
import { AuthUserProfile } from '../utils/authService';
import { KeyRound, LogIn, LogOut, Shield } from 'lucide-react';

interface AchievementManagerProps {
  isOpen: boolean;
  onClose: () => void;
  totalLessons?: number;
  currentUser?: AuthUserProfile | null;
  onChangePassword?: () => void;
  onSignOut?: () => void;
  onSignIn?: () => void;
}

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach-1',
    title: 'UDL Expert',
    description: 'Designed balanced options across Engagement, Representation, and Action & Expression without lowering expectations.',
    icon: '🏆',
    category: 'pedagogy',
    tier: 'gold',
    progress: 10,
    maxProgress: 10,
    unlocked: true,
    unlockedAt: 'Oct 14, 2026',
  },
  {
    id: 'ach-2',
    title: '10 Lessons Created',
    description: 'Designed 10 production-grade universal design lesson plans.',
    icon: '📚',
    category: 'planning',
    tier: 'gold',
    progress: 10,
    maxProgress: 10,
    unlocked: true,
    unlockedAt: 'Today',
  },
  {
    id: 'ach-3',
    title: 'CLEAR Master',
    description: 'Achieved an overall CLEAR quality review score of 18/20 or higher.',
    icon: '🎯',
    category: 'pedagogy',
    tier: 'gold',
    progress: 19,
    maxProgress: 20,
    unlocked: true,
    unlockedAt: 'Oct 12, 2026',
  },
  {
    id: 'ach-4',
    title: 'Goal Guardian',
    description: 'Preserved the core cognitive standard while providing multi-modal student pathways.',
    icon: '🌟',
    category: 'pedagogy',
    tier: 'silver',
    progress: 8,
    maxProgress: 8,
    unlocked: true,
    unlockedAt: 'Oct 10, 2026',
  },
  {
    id: 'ach-5',
    title: 'Barrier Buster',
    description: 'Anticipated 5+ sensory, cognitive, and linguistic barriers proactively.',
    icon: '🛡️',
    category: 'accessibility',
    tier: 'silver',
    progress: 7,
    maxProgress: 7,
    unlocked: true,
    unlockedAt: 'Oct 8, 2026',
  },
  {
    id: 'ach-6',
    title: 'Vision Pioneer',
    description: 'Analyzed educational visuals and generated tactile sorting activities with computer vision.',
    icon: '👁️',
    category: 'technology',
    tier: 'silver',
    progress: 5,
    maxProgress: 5,
    unlocked: true,
    unlockedAt: 'Oct 15, 2026',
  },
  {
    id: 'ach-7',
    title: '3D Spatial Explorer',
    description: 'Embedded interactive Three.js 3D models with exploded-view cross-sections into representation.',
    icon: '🧊',
    category: 'technology',
    tier: 'bronze',
    progress: 3,
    maxProgress: 3,
    unlocked: true,
    unlockedAt: 'Oct 16, 2026',
  },
  {
    id: 'ach-8',
    title: 'Voice Access Champion',
    description: 'Enabled live real-time speech-to-text dictation for student oral assessments.',
    icon: '🎙️',
    category: 'accessibility',
    tier: 'bronze',
    progress: 4,
    maxProgress: 4,
    unlocked: true,
    unlockedAt: 'Oct 17, 2026',
  },
  {
    id: 'ach-9',
    title: 'W3C AAA Champion',
    description: 'Verified full WCAG 2.2 AAA accessibility compliance across lesson plan and software interface.',
    icon: '♿',
    category: 'accessibility',
    tier: 'gold',
    progress: 1,
    maxProgress: 1,
    unlocked: true,
    unlockedAt: 'Today',
  },
  {
    id: 'ach-10',
    title: '25 Lessons Legend',
    description: 'Reach 25 completed universal design lesson plans.',
    icon: '👑',
    category: 'planning',
    tier: 'platinum',
    progress: 10,
    maxProgress: 25,
    unlocked: false,
  },
];

export const AchievementManager: React.FC<AchievementManagerProps> = ({
  isOpen,
  onClose,
  totalLessons = 10,
  currentUser,
  onChangePassword,
  onSignOut,
  onSignIn,
}) => {
  const [filterCategory, setFilterCategory] = useState<'all' | 'planning' | 'accessibility' | 'technology' | 'pedagogy'>('all');
  const [achievements, setAchievements] = useState<Achievement[]>(INITIAL_ACHIEVEMENTS);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(syncManager.getStatus());
  const [syncToast, setSyncToast] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = syncManager.subscribe((status) => {
      setSyncStatus(status);
    });
    return unsubscribe;
  }, []);

  if (!isOpen) return null;

  const handleManualSync = async () => {
    setSyncToast('Syncing changes to cloud...');
    const success = await syncManager.triggerAutoSync();
    if (success) {
      setSyncToast('Cloud synchronization complete!');
      setTimeout(() => setSyncToast(null), 2500);
    }
  };

  const handleExportBackup = () => {
    syncManager.exportOfflineBackup();
    setSyncToast('Offline backup JSON downloaded.');
    setTimeout(() => setSyncToast(null), 2500);
  };

  const filtered = filterCategory === 'all'
    ? achievements
    : achievements.filter((a) => a.category === filterCategory);

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-200">
        
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 leading-tight">
                Teacher Profile & Achievements
              </h2>
              <p className="text-[11px] text-slate-500 font-medium">
                Milestones, Badges & Cloud Sync
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 overflow-y-auto space-y-4 text-xs flex-1">
          
          {/* Teacher Profile Card */}
          <div className="p-4 rounded-xl bg-gradient-to-tr from-blue-900 via-indigo-900 to-slate-900 text-white shadow-md">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 border-2 border-white/60 flex items-center justify-center text-xl shadow-xs overflow-hidden">
                {currentUser?.photoURL ? (
                  <img src={currentUser.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span>👩‍🏫</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold truncate">
                    {currentUser?.displayName || 'Ms. Amanda Chen'}
                  </h3>
                  <span className="px-1.5 py-0.5 rounded bg-orange-500 text-[9px] font-black uppercase tracking-wider">
                    PRO
                  </span>
                </div>
                <p className="text-[11px] text-blue-200 font-medium truncate">
                  {currentUser?.role || '7th Grade Science & UDL Specialist'}
                </p>
                <p className="text-[10px] text-slate-400 truncate">
                  {currentUser?.email || 'teacher@udlplanner.org'} • District STEM Academy
                </p>
              </div>
            </div>

            {/* Level & XP Progress Bar */}
            <div className="pt-2 border-t border-white/10 mb-3">
              <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                <span className="text-orange-300">Level 4 • UDL Master Architect</span>
                <span className="text-slate-300 font-mono text-[10px]">1,850 / 2,000 XP</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div className="bg-gradient-to-r from-orange-500 to-amber-400 h-2 rounded-full transition-all duration-500" style={{ width: '92.5%' }} />
              </div>
            </div>

            {/* Account Credentials & Change Password */}
            <div className="pt-2.5 border-t border-white/10 flex items-center justify-between gap-2">
              <button
                onClick={() => {
                  onClose();
                  onChangePassword?.();
                }}
                className="flex-1 py-1.5 px-2.5 rounded-lg bg-blue-600/70 hover:bg-blue-600 text-white font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-blue-400/30"
                title="Change your account password at any time"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Change Password</span>
              </button>

              {currentUser ? (
                <button
                  onClick={() => {
                    onSignOut?.();
                  }}
                  className="py-1.5 px-2.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                  title="Sign out of your account"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    onClose();
                    onSignIn?.();
                  }}
                  className="py-1.5 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
              )}
            </div>
          </div>

          {/* DataSyncManager LocalStorage & Cloud Sync Status */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                {syncStatus.isOnline ? (
                  <Cloud className="w-4 h-4 text-emerald-600" />
                ) : (
                  <CloudOff className="w-4 h-4 text-amber-600" />
                )}
                <span className="font-bold text-slate-800 text-xs">
                  {syncStatus.isOnline ? 'Cloud Synced' : 'Offline Mode (Local Storage)'}
                </span>
              </div>

              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                syncStatus.isOnline ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {syncStatus.isOnline ? 'Connected' : 'Offline'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 mb-3 bg-white p-2 rounded-lg border border-slate-100 font-medium">
              <div>
                <span className="text-slate-400 block text-[10px]">Last Synced:</span>
                <span className="font-semibold text-slate-700">{syncStatus.lastSyncedAt}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Cached Locally:</span>
                <span className="font-semibold text-slate-700">{syncStatus.storageUsageKb} KB ({syncStatus.pendingChangesCount} queued)</span>
              </div>
            </div>

            {syncToast && (
              <p className="text-[11px] font-bold text-emerald-700 mb-2 animate-in fade-in">
                ✓ {syncToast}
              </p>
            )}

            <div className="flex items-center gap-2">
              <button
                onClick={handleManualSync}
                disabled={syncStatus.isSyncing}
                className="flex-1 py-1.5 px-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] shadow-2xs transition-colors cursor-pointer flex items-center justify-center gap-1 disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 ${syncStatus.isSyncing ? 'animate-spin' : ''}`} />
                <span>{syncStatus.isSyncing ? 'Syncing...' : 'Sync to Cloud'}</span>
              </button>

              <button
                onClick={handleExportBackup}
                className="py-1.5 px-2.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-[11px] transition-colors cursor-pointer flex items-center gap-1"
                title="Download offline JSON backup file"
              >
                <Download className="w-3 h-3" />
                <span>Backup</span>
              </button>
            </div>
          </div>

          {/* Milestone Metrics Summary */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 bg-blue-50 border border-blue-100 rounded-xl">
              <p className="text-base font-black text-blue-900 leading-none">10</p>
              <p className="text-[10px] text-blue-700 font-bold mt-0.5">Lessons Created</p>
            </div>
            <div className="p-2 bg-orange-50 border border-orange-100 rounded-xl">
              <p className="text-base font-black text-orange-900 leading-none">19.3</p>
              <p className="text-[10px] text-orange-700 font-bold mt-0.5">Avg CLEAR</p>
            </div>
            <div className="p-2 bg-emerald-50 border border-emerald-100 rounded-xl">
              <p className="text-base font-black text-emerald-900 leading-none">9/10</p>
              <p className="text-[10px] text-emerald-700 font-bold mt-0.5">Badges Earned</p>
            </div>
          </div>

          {/* Badges Filter Bar */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-orange-500" />
                <span>Earned Badges & Milestones ({unlockedCount}/{achievements.length})</span>
              </h4>
            </div>

            <div className="flex gap-1 overflow-x-auto pb-1 text-[10px] font-semibold">
              {(['all', 'planning', 'accessibility', 'technology', 'pedagogy'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-2 py-0.5 rounded-md capitalize shrink-0 transition-all cursor-pointer ${
                    filterCategory === cat ? 'bg-orange-500 text-white font-bold' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Badges List */}
          <div className="space-y-2">
            {filtered.map((ach) => (
              <div
                key={ach.id}
                className={`p-3 rounded-xl border transition-all ${
                  ach.unlocked
                    ? 'bg-white border-slate-200 shadow-2xs hover:border-orange-300'
                    : 'bg-slate-50 border-slate-200/60 opacity-60'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0 shadow-2xs ${
                    ach.tier === 'gold' ? 'bg-amber-100 border border-amber-300' :
                    ach.tier === 'silver' ? 'bg-slate-100 border border-slate-300' :
                    ach.tier === 'platinum' ? 'bg-purple-100 border border-purple-300' :
                    'bg-orange-100 border border-orange-200'
                  }`}>
                    {ach.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <h5 className="font-bold text-slate-900 truncate text-xs flex items-center gap-1">
                        <span>{ach.title}</span>
                        {ach.unlocked ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Lock className="w-3 h-3 text-slate-400" />
                        )}
                      </h5>
                      <span className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded font-mono ${
                        ach.tier === 'gold' ? 'text-amber-800 bg-amber-50' :
                        ach.tier === 'silver' ? 'text-slate-700 bg-slate-100' :
                        ach.tier === 'platinum' ? 'text-purple-800 bg-purple-50' :
                        'text-orange-800 bg-orange-50'
                      }`}>
                        {ach.tier}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 font-medium leading-relaxed mb-1.5">
                      {ach.description}
                    </p>

                    {/* Progress Bar / Unlocked Date */}
                    {ach.unlocked ? (
                      <p className="text-[10px] text-slate-400 italic">
                        Earned: {ach.unlockedAt}
                      </p>
                    ) : (
                      <div>
                        <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold mb-0.5">
                          <span>Progress: {ach.progress}/{ach.maxProgress}</span>
                          <span>{Math.round((ach.progress / ach.maxProgress) * 100)}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-purple-600 h-1.5 rounded-full"
                            style={{ width: `${(ach.progress / ach.maxProgress) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-medium">
            Local & Cloud auto-synchronized
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-lg text-xs transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
