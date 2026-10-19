import React from 'react';
import { 
  Home, 
  PlusCircle, 
  Sparkles, 
  BookOpen, 
  FolderGit2, 
  Target, 
  Image as ImageIcon, 
  Camera, 
  CheckCircle2, 
  Share2, 
  Settings, 
  HelpCircle,
  Scan,
  Maximize2,
  Eye,
  Wand2,
  Cpu,
  Box,
  Mic,
  Accessibility,
  PenTool,
  Calendar,
  Award,
  Trophy,
  Cloud,
  Video,
  Presentation,
  GraduationCap,
  FileText,
  StickyNote,
  MessageSquare,
  KeyRound,
  LogIn,
  LogOut,
  UserCheck
} from 'lucide-react';
import { AuthUserProfile } from '../utils/authService';

export type NavItem = 
  | 'dashboard' 
  | 'create_lesson' 
  | 'udl_codesigner' 
  | 'workspace_suite'
  | 'google_meet'
  | 'google_slides'
  | 'google_classroom'
  | 'google_docs'
  | 'google_keep'
  | 'google_chat'
  | 'whiteboard'
  | 'calendar_schedule'
  | 'three_d_lab'
  | 'audio_transcribe'
  | 'image_analysis' 
  | 'lesson_library' 
  | 'my_lessons' 
  | 'standards' 
  | 'resources' 
  | 'accessibility_report'
  | 'clear_review' 
  | 'a2a_judge'
  | 'export_share' 
  | 'settings' 
  | 'help';

interface SidebarProps {
  activeItem: NavItem;
  onSelectItem: (item: NavItem) => void;
  onTriggerVisionTool?: (tool: 'recognition' | 'detection' | 'analysis' | 'generate') => void;
  onOpenProfile?: () => void;
  onOpenWorkspace?: (tab?: 'meet' | 'slides' | 'classroom' | 'docs' | 'keep' | 'chat') => void;
  currentUser?: AuthUserProfile | null;
  onOpenAuth?: (mode?: 'sign_in' | 'sign_up' | 'change_password') => void;
  onSignOut?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeItem,
  onSelectItem,
  onTriggerVisionTool,
  onOpenProfile,
  onOpenWorkspace,
  currentUser,
  onOpenAuth,
  onSignOut,
}) => {
  const navButtons: { id: NavItem; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <Home className="w-4 h-4" /> },
    { id: 'create_lesson', label: 'Create Lesson', icon: <PlusCircle className="w-4 h-4" /> },
    { id: 'udl_codesigner', label: 'UDL Co-Designer', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'workspace_suite', label: 'Google Workspace Hub', icon: <Sparkles className="w-4 h-4 text-amber-300" /> },
    { id: 'whiteboard', label: 'Collaborative Whiteboard', icon: <PenTool className="w-4 h-4 text-emerald-400" /> },
    { id: 'calendar_schedule', label: 'Google Calendar Schedule', icon: <Calendar className="w-4 h-4 text-amber-400" /> },
    { id: 'three_d_lab', label: '3D Spatial Lab (Three.js)', icon: <Box className="w-4 h-4 text-sky-400" /> },
    { id: 'audio_transcribe', label: 'Live Audio Transcribe', icon: <Mic className="w-4 h-4 text-orange-400" /> },
    { id: 'image_analysis', label: 'AI Image Analysis', icon: <Camera className="w-4 h-4" /> },
    { id: 'lesson_library', label: 'Lesson Library', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'my_lessons', label: 'My Lessons', icon: <FolderGit2 className="w-4 h-4" /> },
    { id: 'standards', label: 'Standards & Curriculum', icon: <Target className="w-4 h-4" /> },
    { id: 'resources', label: 'Resources & Media', icon: <ImageIcon className="w-4 h-4" /> },
    { id: 'accessibility_report', label: 'W3C Accessibility Audit', icon: <Accessibility className="w-4 h-4 text-sky-400" /> },
    { id: 'clear_review', label: 'CLEAR Review', icon: <CheckCircle2 className="w-4 h-4" /> },
    { id: 'a2a_judge', label: 'A2A Judge & System', icon: <Cpu className="w-4 h-4 text-purple-300" /> },
    { id: 'export_share', label: 'Export & Share', icon: <Share2 className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
    { id: 'help', label: 'Help & Tutorials', icon: <HelpCircle className="w-4 h-4" /> },
  ];

  return (
    <aside className="w-56 md:w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 min-h-[calc(100vh-61px)] p-3 border-r border-slate-800 select-none">
      
      {/* Primary Navigation Buttons in a single panel */}
      <nav className="space-y-1 flex-1">
        {navButtons.map((btn) => {
          const isActive = activeItem === btn.id;
          return (
            <button
              key={btn.id}
              onClick={() => {
                if (btn.id === 'workspace_suite') {
                  onOpenWorkspace?.();
                } else {
                  onSelectItem(btn.id);
                }
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all duration-150 text-left cursor-pointer ${
                isActive
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20 translate-x-0.5'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <span className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}>
                {btn.icon}
              </span>
              <span className="truncate">{btn.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Google Workspace Sub-Panel on Left Panel */}
      <div className="mt-4 pt-3 border-t border-slate-800">
        <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/60 shadow-xs">
          <div className="flex items-center justify-between text-white font-bold text-xs mb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <span className="text-[12px] tracking-wide">Google Workspace</span>
            </div>
            <button 
              onClick={() => onOpenWorkspace?.()}
              className="text-[10px] text-blue-400 hover:text-blue-300 underline cursor-pointer"
            >
              Hub
            </button>
          </div>

          <div className="space-y-1 text-slate-300">
            <button
              onClick={() => onOpenWorkspace?.('meet')}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[11px] font-medium text-slate-300 hover:text-white hover:bg-slate-700/60 transition-colors text-left cursor-pointer"
            >
              <Video className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Google Meet</span>
            </button>

            <button
              onClick={() => onOpenWorkspace?.('slides')}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[11px] font-medium text-slate-300 hover:text-white hover:bg-slate-700/60 transition-colors text-left cursor-pointer"
            >
              <Presentation className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Google Slides</span>
            </button>

            <button
              onClick={() => onOpenWorkspace?.('classroom')}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[11px] font-medium text-slate-300 hover:text-white hover:bg-slate-700/60 transition-colors text-left cursor-pointer"
            >
              <GraduationCap className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Google Classroom</span>
            </button>

            <button
              onClick={() => onOpenWorkspace?.('docs')}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[11px] font-medium text-slate-300 hover:text-white hover:bg-slate-700/60 transition-colors text-left cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>Google Docs</span>
            </button>

            <button
              onClick={() => onOpenWorkspace?.('keep')}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[11px] font-medium text-slate-300 hover:text-white hover:bg-slate-700/60 transition-colors text-left cursor-pointer"
            >
              <StickyNote className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
              <span>Google Keep</span>
            </button>

            <button
              onClick={() => onOpenWorkspace?.('chat')}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[11px] font-medium text-slate-300 hover:text-white hover:bg-slate-700/60 transition-colors text-left cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span>Google Chat</span>
            </button>
          </div>
        </div>
      </div>

      {/* AI Vision Tools Sub-Panel on the Left */}
      <div className="mt-3 pt-2 border-t border-slate-800">
        <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/60 shadow-xs">
          <div className="flex items-center gap-2 text-white font-bold text-xs mb-2.5">
            <div className="w-5 h-5 rounded-md bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <Camera className="w-3.5 h-3.5" />
            </div>
            <span className="text-[12px] tracking-wide">AI Vision Tools</span>
          </div>

          <div className="space-y-1 text-slate-300">
            <button
              onClick={() => onTriggerVisionTool?.('recognition')}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[11px] font-medium text-slate-300 hover:text-white hover:bg-slate-700/60 transition-colors text-left"
            >
              <Scan className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span>Image Recognition</span>
            </button>

            <button
              onClick={() => onTriggerVisionTool?.('detection')}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[11px] font-medium text-slate-300 hover:text-white hover:bg-slate-700/60 transition-colors text-left"
            >
              <Maximize2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Object Detection</span>
            </button>

            <button
              onClick={() => onTriggerVisionTool?.('analysis')}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[11px] font-medium text-slate-300 hover:text-white hover:bg-slate-700/60 transition-colors text-left"
            >
              <Eye className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              <span>Visual Analysis</span>
            </button>

            <button
              onClick={() => onTriggerVisionTool?.('generate')}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[11px] font-medium text-slate-300 hover:text-white hover:bg-slate-700/60 transition-colors text-left"
            >
              <Wand2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span>Generate Activities</span>
            </button>
          </div>
        </div>
      </div>

      {/* Teacher Profile & Earned Badges Summary in Sidebar */}
      <div className="mt-3 bg-slate-800/90 rounded-xl p-3 border border-slate-700/80 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px] font-bold text-white tracking-wide">Earned Badges</span>
          </div>
          <span className="text-[10px] font-semibold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/30">
            6 / 8 Earned
          </span>
        </div>

        {/* Badges preview row */}
        <div className="flex items-center gap-1.5 mb-2.5">
          <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-sm" title="UDL Expert">
            🏆
          </div>
          <div className="w-7 h-7 rounded-lg bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-sm" title="10 Lessons Created">
            📚
          </div>
          <div className="w-7 h-7 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-sm" title="CLEAR Master">
            🎯
          </div>
          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-sm" title="Goal Guardian">
            🌟
          </div>
          <button 
            onClick={onOpenProfile}
            className="text-[10px] font-semibold text-slate-400 hover:text-white transition-colors ml-auto underline cursor-pointer"
          >
            +2 more
          </button>
        </div>

        {/* Milestone stats */}
        <div className="space-y-1 mb-2 text-[10px] text-slate-300">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Milestone</span>
            <span className="font-semibold text-white">10 Lessons Created</span>
          </div>
          <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
            <div className="bg-amber-400 h-full rounded-full w-full" />
          </div>
        </div>

        {/* Cloud Auto-Sync Status Indicator */}
        <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-[10px]">
          <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Cloud Auto-Sync</span>
          </div>
          <span className="text-slate-400 font-mono text-[9px]">Live</span>
        </div>

        <button
          onClick={onOpenProfile}
          className="w-full mt-2 py-1.5 px-2 rounded-lg bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 border border-orange-500/30 text-[11px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
        >
          <span>View All Milestones</span>
          <span>→</span>
        </button>
      </div>

      {/* Teacher Account & Password Security */}
      <div className="mt-3 bg-slate-800/90 rounded-xl p-3 border border-slate-700/80 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-[11px] font-bold text-white tracking-wide">Account & Security</span>
          </div>
          {currentUser && (
            <span className="text-[9.5px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
              Active
            </span>
          )}
        </div>

        {currentUser ? (
          <div className="space-y-2">
            <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800">
              <p className="text-xs font-bold text-white truncate">
                {currentUser.displayName || 'Educator'}
              </p>
              <p className="text-[10px] text-slate-400 truncate">
                {currentUser.email || 'teacher@udlplanner.org'}
              </p>
            </div>

            {/* Instant Change Password button */}
            <button
              onClick={() => onOpenAuth?.('change_password')}
              className="w-full py-1.5 px-2 rounded-lg bg-blue-600/30 hover:bg-blue-600/50 text-blue-200 border border-blue-500/30 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              title="Change your password at any time"
            >
              <KeyRound className="w-3.5 h-3.5 text-blue-400" />
              <span>Change Password</span>
            </button>

            <button
              onClick={onSignOut}
              className="w-full py-1 px-2 rounded-lg text-slate-400 hover:text-rose-300 hover:bg-rose-500/10 text-[10.5px] font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
            >
              <LogOut className="w-3 h-3" />
              <span>Sign Out</span>
            </button>
          </div>
        ) : (
          <div className="space-y-1.5">
            <p className="text-[10.5px] text-slate-400 leading-snug">
              Sign in to save and sync your UDL lessons across devices.
            </p>
            <div className="flex items-center gap-1.5 pt-1">
              <button
                onClick={() => onOpenAuth?.('sign_in')}
                className="flex-1 py-1 px-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-bold text-[10.5px] text-center transition-colors cursor-pointer"
              >
                Sign In
              </button>
              <button
                onClick={() => onOpenAuth?.('sign_up')}
                className="flex-1 py-1 px-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10.5px] text-center transition-colors cursor-pointer"
              >
                Sign Up
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile / PWA Download Badge */}
      <div className="mt-2.5 px-2 py-1.5 bg-blue-950/40 rounded-lg border border-blue-900/50 flex items-center justify-between text-[10px] text-blue-300">
        <span>iOS & Android Ready</span>
        <span className="px-1.5 py-0.5 rounded bg-blue-600/30 text-[9px] text-blue-200 font-mono">PWA</span>
      </div>

    </aside>
  );
};
