import React, { useState } from 'react';
import { X, MessageSquare, Users, Send, Check, Share2, Link as LinkIcon, Mail } from 'lucide-react';
import { LessonPlan } from '../types/lesson';

interface WorkspaceShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  lesson: LessonPlan;
}

const SAMPLE_CONTACTS = [
  { id: 'c1', name: 'Dr. Sarah Lin', role: 'Curriculum Director & UDL Coach', email: 's.lin@district.edu', avatar: '👩‍🏫' },
  { id: 'c2', name: 'Marcus Miller', role: '7th Grade Science Co-Teacher', email: 'm.miller@district.edu', avatar: '👨‍🔬' },
  { id: 'c3', name: 'Elena Rostova', role: 'Accessibility & Assistive Tech Specialist', email: 'e.rostova@district.edu', avatar: '👩‍💻' },
  { id: 'c4', name: 'Jordan Hayes', role: 'Special Education Case Manager', email: 'j.hayes@district.edu', avatar: '🧑‍🏫' },
];

const CHAT_SPACES = [
  { id: 'sp1', name: 'Science Dept - Grade 7 PLC', members: 6 },
  { id: 'sp2', name: 'Inclusive Learning Design Team', members: 12 },
  { id: 'sp3', name: 'STEM Curriculum Planning 2026', members: 18 },
];

export const WorkspaceShareModal: React.FC<WorkspaceShareModalProps> = ({
  isOpen,
  onClose,
  lesson,
}) => {
  const [selectedTab, setSelectedTab] = useState<'chat' | 'contacts'>('chat');
  const [selectedSpace, setSelectedSpace] = useState(CHAT_SPACES[0].id);
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [messageNote, setMessageNote] = useState(
    `Hello! Here is the UDL Lesson Plan for "${lesson.title}". All options have been audited and scored with CLEAR (19.3/20 READY). Please review our multi-modal pathways!`
  );
  const [sentSuccess, setSentSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const handleSend = () => {
    setSentSuccess(true);
    setTimeout(() => {
      setSentSuccess(false);
      onClose();
    }, 1800);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Share Lesson with Google Workspace
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Collaborate via Google Chat and District Contacts
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="px-5 pt-3 flex border-b border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setSelectedTab('chat')}
            className={`flex items-center gap-1.5 pb-2.5 px-3 border-b-2 cursor-pointer transition-all ${
              selectedTab === 'chat'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Google Chat Space</span>
          </button>

          <button
            onClick={() => setSelectedTab('contacts')}
            className={`flex items-center gap-1.5 pb-2.5 px-3 border-b-2 cursor-pointer transition-all ${
              selectedTab === 'contacts'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>District Contacts</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 space-y-4 text-xs">
          {selectedTab === 'chat' ? (
            <div>
              <label className="block text-slate-700 font-bold mb-1.5">
                Select Google Chat Space:
              </label>
              <div className="space-y-1.5">
                {CHAT_SPACES.map((sp) => (
                  <div
                    key={sp.id}
                    onClick={() => setSelectedSpace(sp.id)}
                    className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                      selectedSpace === sp.id
                        ? 'border-blue-500 bg-blue-50/70 text-blue-900 font-semibold'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-blue-100 text-blue-600 flex items-center justify-center">
                        #
                      </div>
                      <span>{sp.name}</span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-normal">
                      {sp.members} members
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-slate-700 font-bold mb-1.5">
                Select Colleague Contact:
              </label>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {SAMPLE_CONTACTS.map((con) => (
                  <div
                    key={con.id}
                    onClick={() => setSelectedContact(con.id)}
                    className={`flex items-center justify-between p-2 rounded-xl border transition-all cursor-pointer ${
                      selectedContact === con.id
                        ? 'border-blue-500 bg-blue-50/70 text-blue-900 font-semibold'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">{con.avatar}</span>
                      <div>
                        <p className="font-bold text-slate-800 leading-tight">{con.name}</p>
                        <p className="text-[10px] text-slate-400">{con.role}</p>
                      </div>
                    </div>
                    <span className="text-[11px] text-slate-500">{con.email}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Note */}
          <div>
            <label className="block text-slate-700 font-bold mb-1">
              Message Note:
            </label>
            <textarea
              rows={2}
              value={messageNote}
              onChange={(e) => setMessageNote(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none text-xs"
            />
          </div>

          {/* Quick link copy */}
          <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-600">
            <span className="text-[11px] truncate mr-2">
              https://lessonplanner.ai/share/{lesson.id}
            </span>
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1 text-[11px] text-blue-600 font-bold hover:underline shrink-0 cursor-pointer"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <LinkIcon className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Copied' : 'Copy Link'}</span>
            </button>
          </div>

          {sentSuccess && (
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 font-bold text-xs flex items-center justify-center gap-1.5 animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Lesson Plan shared to Google Workspace successfully!</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={handleSend}
            disabled={sentSuccess}
            className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send via Google Workspace</span>
          </button>
        </div>

      </div>
    </div>
  );
};
