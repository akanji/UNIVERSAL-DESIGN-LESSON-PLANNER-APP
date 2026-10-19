import React from 'react';
import { 
  Users, 
  Accessibility, 
  Lightbulb, 
  BarChart3, 
  Brain, 
  Search, 
  Bell, 
  ChevronDown, 
  Sparkles 
} from 'lucide-react';

import { AuthUserProfile } from '../utils/authService';
import { LogIn, UserPlus, KeyRound, LogOut, Award, Shield } from 'lucide-react';

interface HeaderProps {
  onSearch?: (query: string) => void;
  onOpenNotifications?: () => void;
  onOpenProfile?: () => void;
  onOpenAccessibilityReport?: () => void;
  onOpenWorkspace?: () => void;
  currentUser?: AuthUserProfile | null;
  onOpenAuth?: (mode?: 'sign_in' | 'sign_up' | 'change_password') => void;
  onSignOut?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onSearch,
  onOpenNotifications,
  onOpenProfile,
  onOpenAccessibilityReport,
  onOpenWorkspace,
  currentUser,
  onOpenAuth,
  onSignOut,
}) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs px-4 py-2.5">
      <div className="max-w-[1920px] mx-auto flex items-center justify-between gap-4">
        
        {/* Logo and Tagline */}
        <div className="flex items-center gap-3 min-w-max">
          <div className="w-11 h-11 relative flex items-center justify-center bg-gradient-to-tr from-blue-600 via-sky-400 to-orange-500 rounded-xl shadow-sm text-white">
            <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white stroke-none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
            </svg>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-orange-500 flex items-center justify-center text-[9px] font-bold">
              ✦
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5 leading-tight">
              <span className="text-xl font-black tracking-tight text-blue-900">
                UNIVERSAL DESIGN
              </span>
              <span className="text-xl font-black tracking-tight text-orange-500">
                LESSON PLANNER
              </span>
            </div>
            <p className="text-[11.5px] font-medium text-slate-500 leading-tight">
              One learning goal. More purposeful pathways. <span className="text-teal-600 font-semibold">Better-designed learning.</span>
            </p>
          </div>
        </div>

        {/* Center Pillars */}
        <div className="hidden xl:flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold shadow-2xs">
            <Users className="w-3.5 h-3.5 text-blue-600" />
            <span>Inclusive</span>
          </div>

          <button
            onClick={onOpenAccessibilityReport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-800 text-xs font-semibold shadow-2xs transition-all cursor-pointer"
            title="View W3C Accessibility Compliance Report"
          >
            <Accessibility className="w-3.5 h-3.5 text-sky-600" />
            <span>Accessible (W3C AAA)</span>
          </button>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-100 text-amber-700 text-xs font-semibold shadow-2xs">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            <span>Engaging</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold shadow-2xs">
            <BarChart3 className="w-3.5 h-3.5 text-indigo-600" />
            <span>Data-Informed</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-50 border border-purple-100 text-purple-700 text-xs font-semibold shadow-2xs">
            <Brain className="w-3.5 h-3.5 text-purple-600" />
            <span>AI-Powered</span>
          </div>

          <button
            onClick={onOpenWorkspace}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-2xs transition-all cursor-pointer"
            title="Open Google Workspace Hub (Meet, Slides, Classroom, Docs, Keep, Chat)"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Google Workspace</span>
          </button>
        </div>

        {/* Right side search and profile */}
        <div className="flex items-center gap-3">
          <div className="relative hidden md:block w-64 lg:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search lessons, standards..."
              onChange={(e) => onSearch?.(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>

          {/* Notifications */}
          <button 
            onClick={onOpenNotifications}
            title="Notifications (3 active UDL checks)"
            className="relative p-2 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-slate-100 transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-4 h-4 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              3
            </span>
          </button>

          {/* User Profile or Auth Buttons */}
          {currentUser ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-all text-left cursor-pointer shadow-2xs"
                title="Account Menu & Profile"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-2xs overflow-hidden ring-1 ring-white relative">
                  {currentUser.photoURL ? (
                    <img src={currentUser.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[11px] font-bold">
                      {currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : '👩‍🏫'}
                    </span>
                  )}
                  <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-white" />
                </div>
                <div className="flex flex-col max-w-[130px]">
                  <div className="flex items-center gap-1 leading-none">
                    <span className="text-xs font-bold text-slate-800 truncate">
                      {currentUser.displayName || 'Educator'}
                    </span>
                    <span className="px-1 py-0.2 rounded bg-amber-100 text-amber-800 font-bold text-[9px]">L4</span>
                    <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
                  </div>
                  <span className="text-[9.5px] text-orange-600 font-semibold leading-tight truncate">
                    {currentUser.role || 'UDL Specialist'}
                  </span>
                </div>
              </button>

              {/* Account Dropdown Menu */}
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {currentUser.displayName || 'Educator'}
                    </p>
                    <p className="text-[11px] text-slate-500 font-medium truncate">
                      {currentUser.email || 'teacher@udlplanner.org'}
                    </p>
                    <div className="mt-1.5 flex items-center gap-1.5">
                      <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-bold text-[9px]">
                        Teacher Account
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-[9px] flex items-center gap-0.5">
                        <Shield className="w-2.5 h-2.5" /> Verified
                      </span>
                    </div>
                  </div>

                  {/* Change Password Action - accessible at any time */}
                  <div className="p-1">
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        onOpenAuth?.('change_password');
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors text-left cursor-pointer group"
                    >
                      <KeyRound className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                      <div className="flex-1">
                        <span className="block font-bold">Change Password</span>
                        <span className="block text-[10px] text-slate-400 group-hover:text-blue-500">Update account credentials</span>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        onOpenProfile?.();
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors text-left cursor-pointer group"
                    >
                      <Award className="w-4 h-4 text-orange-500" />
                      <div className="flex-1">
                        <span className="block font-bold">Milestones & Badges</span>
                        <span className="block text-[10px] text-slate-400">View progress & cloud sync</span>
                      </div>
                    </button>
                  </div>

                  <div className="border-t border-slate-100 p-1">
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        onSignOut?.();
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors text-left cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAuth?.('sign_in')}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
              <button
                onClick={() => onOpenAuth?.('sign_up')}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Sign Up</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
