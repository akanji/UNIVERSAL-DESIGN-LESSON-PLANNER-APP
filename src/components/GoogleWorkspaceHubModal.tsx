import React, { useState, useEffect } from 'react';
import {
  X,
  Video,
  Presentation,
  GraduationCap,
  FileText,
  StickyNote,
  MessageSquare,
  ExternalLink,
  Check,
  AlertCircle,
  Copy,
  Plus,
  Send,
  Sparkles,
  Loader2,
  Calendar,
  LogOut,
  ShieldCheck,
  RefreshCw,
  FolderOpen
} from 'lucide-react';
import { User } from 'firebase/auth';
import { LessonPlan } from '../types/lesson';
import { 
  initAuth, 
  googleSignIn, 
  logout, 
  getAccessToken 
} from '../utils/workspaceAuth';
import {
  createGoogleMeetSpace,
  createGoogleDocForLesson,
  createGoogleSlidesForLesson,
  listClassroomCourses,
  postClassroomAnnouncement,
  createClassroomAssignment,
  listChatSpaces,
  sendChatMessage,
  prepareKeepNoteForLesson,
  openInGoogleKeep,
  ClassroomCourse,
  ChatSpace,
  MeetSpaceResponse,
  DocResponse,
  SlidesResponse
} from '../utils/workspaceServices';

export type WorkspaceTab = 'meet' | 'slides' | 'classroom' | 'docs' | 'keep' | 'chat';

interface GoogleWorkspaceHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  lesson: LessonPlan;
  initialTab?: WorkspaceTab;
}

export const GoogleWorkspaceHubModal: React.FC<GoogleWorkspaceHubModalProps> = ({
  isOpen,
  onClose,
  lesson,
  initialTab = 'meet',
}) => {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>(initialTab);
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  // Destructive / Mutating Confirmation Dialog state
  const [pendingConfirmation, setPendingConfirmation] = useState<{
    actionTitle: string;
    description: string;
    onConfirm: () => Promise<void>;
  } | null>(null);

  // Google Meet state
  const [meetSpace, setMeetSpace] = useState<MeetSpaceResponse | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Google Docs state
  const [createdDoc, setCreatedDoc] = useState<DocResponse | null>(null);

  // Google Slides state
  const [createdSlides, setCreatedSlides] = useState<SlidesResponse | null>(null);

  // Google Classroom state
  const [courses, setCourses] = useState<ClassroomCourse[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [classroomPostType, setClassroomPostType] = useState<'announcement' | 'assignment'>('announcement');
  const [classroomSuccessLink, setClassroomSuccessLink] = useState<string | null>(null);

  // Google Chat state
  const [chatSpaces, setChatSpaces] = useState<ChatSpace[]>([]);
  const [selectedSpaceName, setSelectedSpaceName] = useState<string>('');
  const [customChatMessage, setCustomChatMessage] = useState<string>('');
  const [chatSentSuccess, setChatSentSuccess] = useState<boolean>(false);

  // Google Keep state
  const keepNote = prepareKeepNoteForLesson(lesson);
  const [keepCopied, setKeepCopied] = useState(false);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, token) => {
        setUser(currentUser);
        setAccessToken(token);
      },
      () => {
        setUser(null);
        setAccessToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (accessToken && activeTab === 'classroom' && courses.length === 0) {
      fetchCourses();
    }
    if (accessToken && activeTab === 'chat' && chatSpaces.length === 0) {
      fetchChatSpaces();
    }
  }, [accessToken, activeTab]);

  const handleSignIn = async () => {
    setIsLoggingIn(true);
    setStatusMessage(null);
    try {
      const res = await googleSignIn();
      if (res) {
        setUser(res.user);
        setAccessToken(res.accessToken);
        setStatusMessage({ type: 'success', text: `Signed in as ${res.user.displayName || res.user.email}!` });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Google Workspace sign-in failed.' });
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSignOut = async () => {
    await logout();
    setUser(null);
    setAccessToken(null);
    setCourses([]);
    setChatSpaces([]);
    setStatusMessage({ type: 'info', text: 'Signed out of Google Workspace.' });
  };

  // Google Meet Handler
  const handleCreateMeet = async () => {
    setPendingConfirmation({
      actionTitle: 'Create Google Meet Room',
      description: `Create a new Google Meet conference space for "${lesson.title}" (${lesson.gradeLevel})? This generates a dedicated video call URL for your class.`,
      onConfirm: async () => {
        setLoadingAction('meet');
        setStatusMessage(null);
        try {
          const space = await createGoogleMeetSpace();
          setMeetSpace(space);
          setStatusMessage({ type: 'success', text: 'Google Meet space created successfully!' });
        } catch (err: any) {
          setStatusMessage({ type: 'error', text: err.message });
        } finally {
          setLoadingAction(null);
        }
      },
    });
  };

  // Google Docs Handler
  const handleCreateDoc = async () => {
    setPendingConfirmation({
      actionTitle: 'Create Google Doc in Drive',
      description: `Create a new Google Doc with the complete UDL lesson plan, learning goals, pathways, and accommodations in your Google Drive?`,
      onConfirm: async () => {
        setLoadingAction('docs');
        setStatusMessage(null);
        try {
          const doc = await createGoogleDocForLesson(lesson);
          setCreatedDoc(doc);
          setStatusMessage({ type: 'success', text: 'Google Doc created in your Drive!' });
        } catch (err: any) {
          setStatusMessage({ type: 'error', text: err.message });
        } finally {
          setLoadingAction(null);
        }
      },
    });
  };

  // Google Slides Handler
  const handleCreateSlides = async () => {
    setPendingConfirmation({
      actionTitle: 'Generate Google Slides Presentation',
      description: `Create a new Google Slides presentation deck structured for Universal Design for Learning (UDL) in your Google Drive?`,
      onConfirm: async () => {
        setLoadingAction('slides');
        setStatusMessage(null);
        try {
          const slides = await createGoogleSlidesForLesson(lesson);
          setCreatedSlides(slides);
          setStatusMessage({ type: 'success', text: 'Google Slides presentation created!' });
        } catch (err: any) {
          setStatusMessage({ type: 'error', text: err.message });
        } finally {
          setLoadingAction(null);
        }
      },
    });
  };

  // Google Classroom Handlers
  const fetchCourses = async () => {
    setLoadingAction('courses');
    try {
      const data = await listClassroomCourses();
      setCourses(data);
      if (data.length > 0 && !selectedCourseId) {
        setSelectedCourseId(data[0].id);
      }
    } catch (err: any) {
      console.warn('Could not list classroom courses:', err);
    } finally {
      setLoadingAction(null);
    }
  };

  const handlePostToClassroom = async () => {
    if (!selectedCourseId) {
      setStatusMessage({ type: 'error', text: 'Please select a Google Classroom course.' });
      return;
    }
    const targetCourse = courses.find(c => c.id === selectedCourseId);
    const courseName = targetCourse?.name || 'Selected Class';

    setPendingConfirmation({
      actionTitle: classroomPostType === 'announcement' ? 'Publish Announcement to Classroom' : 'Create Assignment in Classroom',
      description: `Publish this UDL Lesson Plan as an ${classroomPostType} to "${courseName}"? Students enrolled will receive notifications.`,
      onConfirm: async () => {
        setLoadingAction('classroom');
        setStatusMessage(null);
        try {
          if (classroomPostType === 'announcement') {
            const announcementText = `🌟 [UDL Lesson] ${lesson.title}\n\nFirm Learning Goal: ${lesson.learningGoal}\n\nCheck the multi-modal pathways and activities prepared for today!`;
            const res = await postClassroomAnnouncement(selectedCourseId, announcementText);
            setClassroomSuccessLink(res.alternateLink || `https://classroom.google.com/c/${selectedCourseId}`);
          } else {
            const res = await createClassroomAssignment(selectedCourseId, lesson);
            setClassroomSuccessLink(res.alternateLink || `https://classroom.google.com/c/${selectedCourseId}`);
          }
          setStatusMessage({ type: 'success', text: `Successfully published to Google Classroom: ${courseName}!` });
        } catch (err: any) {
          setStatusMessage({ type: 'error', text: err.message });
        } finally {
          setLoadingAction(null);
        }
      },
    });
  };

  // Google Chat Handlers
  const fetchChatSpaces = async () => {
    setLoadingAction('chat_spaces');
    try {
      const data = await listChatSpaces();
      setChatSpaces(data);
      if (data.length > 0 && !selectedSpaceName) {
        setSelectedSpaceName(data[0].name);
      }
    } catch (err: any) {
      console.warn('Google Chat Spaces notice:', err.message);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleSendChatMessage = async () => {
    if (!selectedSpaceName) {
      setStatusMessage({ type: 'error', text: 'Please select a Google Chat space.' });
      return;
    }

    const messageText = customChatMessage.trim() || 
      `📋 [UDL Lesson Plan Shared] "${lesson.title}" (${lesson.gradeLevel})\n\nFirm Goal: ${lesson.learningGoal}\nCLEAR Score: 19.3/20 READY\nCo-teachers, please review the multi-modal pathways!`;

    setPendingConfirmation({
      actionTitle: 'Send Google Chat Message',
      description: `Send this lesson plan notification to the selected Google Chat room on your behalf?`,
      onConfirm: async () => {
        setLoadingAction('chat_send');
        setStatusMessage(null);
        try {
          await sendChatMessage(selectedSpaceName, messageText);
          setChatSentSuccess(true);
          setStatusMessage({ type: 'success', text: 'Message posted to Google Chat space!' });
        } catch (err: any) {
          setStatusMessage({ type: 'error', text: err.message });
        } finally {
          setLoadingAction(null);
        }
      },
    });
  };

  const copyToClipboard = (text: string, setCopied: (v: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950/80 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">Google Workspace Integration Suite</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-800">
                  Ready
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Directly connect Meet, Slides, Classroom, Docs, Keep & Chat with your UDL Lesson Plans
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700 text-xs text-slate-300">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] overflow-hidden">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName || 'User'} className="w-full h-full object-cover" />
                  ) : (
                    (user.displayName?.[0] || 'U').toUpperCase()
                  )}
                </div>
                <span className="max-w-[120px] truncate font-medium">{user.displayName || user.email}</span>
                <button
                  onClick={handleSignOut}
                  title="Sign Out"
                  className="text-slate-400 hover:text-rose-400 p-0.5 ml-1 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : null}

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Status Toast Banner */}
        {statusMessage && (
          <div className={`px-6 py-2.5 flex items-center justify-between text-xs font-medium border-b ${
            statusMessage.type === 'success' 
              ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60' 
              : statusMessage.type === 'error'
              ? 'bg-rose-950/60 text-rose-300 border-rose-800/60'
              : 'bg-blue-950/60 text-blue-300 border-blue-800/60'
          }`}>
            <div className="flex items-center gap-2">
              {statusMessage.type === 'success' && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
              {statusMessage.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
              {statusMessage.type === 'info' && <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />}
              <span>{statusMessage.text}</span>
            </div>
            <button onClick={() => setStatusMessage(null)} className="text-slate-400 hover:text-white cursor-pointer">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-6 pt-3 bg-slate-950/40 border-b border-slate-800 overflow-x-auto">
          <button
            onClick={() => setActiveTab('meet')}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-t-lg text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'meet'
                ? 'border-blue-500 text-blue-400 bg-slate-800/70'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
            }`}
          >
            <Video className="w-4 h-4 text-emerald-400" />
            <span>Google Meet</span>
          </button>

          <button
            onClick={() => setActiveTab('slides')}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-t-lg text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'slides'
                ? 'border-amber-500 text-amber-400 bg-slate-800/70'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
            }`}
          >
            <Presentation className="w-4 h-4 text-amber-400" />
            <span>Google Slides</span>
          </button>

          <button
            onClick={() => setActiveTab('classroom')}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-t-lg text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'classroom'
                ? 'border-emerald-500 text-emerald-400 bg-slate-800/70'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-emerald-400" />
            <span>Google Classroom</span>
          </button>

          <button
            onClick={() => setActiveTab('docs')}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-t-lg text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'docs'
                ? 'border-blue-500 text-blue-400 bg-slate-800/70'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
            }`}
          >
            <FileText className="w-4 h-4 text-blue-400" />
            <span>Google Docs</span>
          </button>

          <button
            onClick={() => setActiveTab('keep')}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-t-lg text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'keep'
                ? 'border-yellow-500 text-yellow-400 bg-slate-800/70'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
            }`}
          >
            <StickyNote className="w-4 h-4 text-yellow-400" />
            <span>Google Keep</span>
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-t-lg text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'chat'
                ? 'border-purple-500 text-purple-400 bg-slate-800/70'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-purple-400" />
            <span>Google Chat</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Sign In Banner if not authenticated */}
          {!accessToken && (
            <div className="p-5 rounded-xl bg-gradient-to-r from-blue-950/60 to-purple-950/60 border border-blue-800/60 flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-400" />
                  Connect your Google Workspace Account
                </h3>
                <p className="text-xs text-slate-300 max-w-xl">
                  Sign in with Google to grant permission for this app to create Google Meet spaces, export to Slides & Docs, post to Classroom, and notify your Chat spaces.
                </p>
              </div>

              {/* Official Google Material Button Style */}
              <button
                onClick={handleSignIn}
                disabled={isLoggingIn}
                className="gsi-material-button shrink-0 flex items-center gap-3 px-4 py-2.5 rounded-lg bg-white hover:bg-slate-100 text-slate-800 font-medium text-xs shadow-md transition-all cursor-pointer border border-slate-300 disabled:opacity-50"
              >
                {isLoggingIn ? (
                  <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                  </svg>
                )}
                <span className="gsi-material-button-contents font-semibold">
                  {isLoggingIn ? 'Connecting...' : 'Sign in with Google'}
                </span>
              </button>
            </div>
          )}

          {/* TAB 1: Google Meet */}
          {activeTab === 'meet' && (
            <div className="space-y-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Video className="w-5 h-5 text-emerald-400" />
                    Google Meet Live Video Sessions
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Generate an instant or scheduled Google Meet video conference space for lesson co-planning, virtual breakout discussions, or hybrid student accommodations.
                  </p>
                </div>
                <button
                  onClick={handleCreateMeet}
                  disabled={loadingAction === 'meet'}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-colors cursor-pointer disabled:opacity-50"
                >
                  {loadingAction === 'meet' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  Create Meet Space
                </button>
              </div>

              {/* Lesson Summary Card */}
              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80">
                <div className="text-xs font-semibold text-slate-300 mb-1">Associated Lesson Plan</div>
                <div className="text-sm font-bold text-white">{lesson.title}</div>
                <div className="text-xs text-slate-400 mt-1">
                  Grade: {lesson.gradeLevel} • Subject: {lesson.subject} • Duration: {lesson.duration}
                </div>
              </div>

              {meetSpace && (
                <div className="p-5 rounded-xl bg-emerald-950/40 border border-emerald-800/80 space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">Meet Space Active</span>
                    </div>
                    <a
                      href={meetSpace.meetingUri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors"
                    >
                      <span>Join Meeting</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-700">
                      <div className="text-slate-400 mb-1">Meeting Link</div>
                      <div className="font-mono text-white truncate">{meetSpace.meetingUri}</div>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-700">
                      <div className="text-slate-400 mb-1">Meeting Code</div>
                      <div className="font-mono font-bold text-emerald-400">{meetSpace.meetingCode || meetSpace.meetingUri.split('/').pop()}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyToClipboard(meetSpace.meetingUri, setCopiedLink)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
                    >
                      {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedLink ? 'Copied Link' : 'Copy Invitation Link'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Google Slides */}
          {activeTab === 'slides' && (
            <div className="space-y-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Presentation className="w-5 h-5 text-amber-400" />
                    Google Slides Presentation Deck
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Automatically convert this lesson plan into an interactive Google Slides deck with dedicated slides for Multi-modal Engagement, Representation, and Action/Expression.
                  </p>
                </div>
                <button
                  onClick={handleCreateSlides}
                  disabled={loadingAction === 'slides'}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md transition-colors cursor-pointer disabled:opacity-50"
                >
                  {loadingAction === 'slides' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  Generate Slide Deck
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 text-xs space-y-1">
                  <div className="font-bold text-amber-400">Slide 1: Firm Goal</div>
                  <p className="text-slate-300 text-[11px] line-clamp-3">{lesson.learningGoal}</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 text-xs space-y-1">
                  <div className="font-bold text-blue-400">Slide 2: 3 UDL Pathways</div>
                  <p className="text-slate-300 text-[11px]">Visual diagramming, audio transcripts, hands-on inquiry.</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 text-xs space-y-1">
                  <div className="font-bold text-emerald-400">Slide 3: Assessment Rubric</div>
                  <p className="text-slate-300 text-[11px]">CLEAR Score 19.3/20 ready rubrics and accommodation guides.</p>
                </div>
              </div>

              {createdSlides && (
                <div className="p-5 rounded-xl bg-amber-950/40 border border-amber-800/80 space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-amber-300">Presentation Created in Google Drive</div>
                      <div className="text-sm font-semibold text-white">{createdSlides.title}</div>
                    </div>
                    <a
                      href={createdSlides.slidesUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-colors"
                    >
                      <span>Open in Google Slides</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Google Classroom */}
          {activeTab === 'classroom' && (
            <div className="space-y-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-emerald-400" />
                    Google Classroom Sync & Distribution
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Select an active course from your Google Classroom roster to post stream announcements or assign coursework with student instructions.
                  </p>
                </div>
                <button
                  onClick={fetchCourses}
                  disabled={loadingAction === 'courses'}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingAction === 'courses' ? 'animate-spin' : ''}`} />
                  <span>Refresh Courses</span>
                </button>
              </div>

              {courses.length > 0 ? (
                <div className="space-y-4 p-5 rounded-xl bg-slate-800/60 border border-slate-700">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Select Classroom Course</label>
                      <select
                        value={selectedCourseId}
                        onChange={(e) => setSelectedCourseId(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-hidden focus:border-emerald-500"
                      >
                        {courses.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name} {c.section ? `(${c.section})` : ''}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Publication Type</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setClassroomPostType('announcement')}
                          className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                            classroomPostType === 'announcement'
                              ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                              : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                          }`}
                        >
                          Stream Announcement
                        </button>
                        <button
                          type="button"
                          onClick={() => setClassroomPostType('assignment')}
                          className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                            classroomPostType === 'assignment'
                              ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                              : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                          }`}
                        >
                          CourseWork Assignment
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-xs text-slate-400">
                      Will publish for: <strong className="text-white">{courses.find(c => c.id === selectedCourseId)?.name || 'Class'}</strong>
                    </span>
                    <button
                      onClick={handlePostToClassroom}
                      disabled={loadingAction === 'classroom'}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {loadingAction === 'classroom' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      Publish to Classroom
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-6 rounded-xl bg-slate-800/40 border border-dashed border-slate-700 text-center space-y-2">
                  <GraduationCap className="w-8 h-8 text-slate-500 mx-auto" />
                  <div className="text-xs font-medium text-slate-300">No active Google Classroom courses retrieved yet</div>
                  <p className="text-[11px] text-slate-400 max-w-md mx-auto">
                    Ensure your account has teacher courses created on Google Classroom. Click "Refresh Courses" to load.
                  </p>
                </div>
              )}

              {classroomSuccessLink && (
                <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/80 flex items-center justify-between">
                  <div className="text-xs text-emerald-300 font-semibold">Post published to Google Classroom stream!</div>
                  <a
                    href={classroomSuccessLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                  >
                    <span>View in Classroom</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Google Docs */}
          {activeTab === 'docs' && (
            <div className="space-y-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-400" />
                    Google Docs Comprehensive Plan
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Export your full lesson plan with formatted standard codes, firm learning objectives, multiple means of representation, and differentiation accommodations to a Google Doc.
                  </p>
                </div>
                <button
                  onClick={handleCreateDoc}
                  disabled={loadingAction === 'docs'}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-colors cursor-pointer disabled:opacity-50"
                >
                  {loadingAction === 'docs' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  Create Google Doc
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 space-y-2 text-xs">
                <div className="text-slate-300 font-bold">Document Outline Preview:</div>
                <ul className="space-y-1 text-slate-400 pl-4 list-disc text-[11px]">
                  <li>Header: Subject, Grade Level, Standards alignment</li>
                  <li>Firm Learning Goals & Measurable Objectives</li>
                  <li>Universal Design for Learning 3-Pillar Framework</li>
                  <li>Multi-modal Learning Pathways (Tactile, Audio, Visual)</li>
                  <li>Specialist Differentiation: Struggling Learners, Advanced Learners, ELLs</li>
                  <li>Assessment & Evaluation Rubric</li>
                </ul>
              </div>

              {createdDoc && (
                <div className="p-5 rounded-xl bg-blue-950/40 border border-blue-800/80 space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-blue-300">Document Created in Google Drive</div>
                      <div className="text-sm font-semibold text-white">{createdDoc.title}</div>
                    </div>
                    <a
                      href={createdDoc.documentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors"
                    >
                      <span>Open in Google Docs</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: Google Keep */}
          {activeTab === 'keep' && (
            <div className="space-y-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <StickyNote className="w-5 h-5 text-yellow-400" />
                    Google Keep Teacher Notes & Checklists
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Export quick lesson reminders, classroom accommodation checklists, and assistive technology setups directly into Google Keep notes.
                  </p>
                </div>
                <button
                  onClick={() => openInGoogleKeep(keepNote)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-yellow-600 hover:bg-yellow-500 text-slate-950 font-bold text-xs shadow-md transition-colors cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open Note in Google Keep
                </button>
              </div>

              {/* Keep Card preview */}
              <div className="p-5 rounded-xl bg-amber-950/20 border border-yellow-700/60 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-yellow-400">{keepNote.title}</div>
                  <button
                    onClick={() => copyToClipboard(keepNote.text, setKeepCopied)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium border border-slate-700 cursor-pointer"
                  >
                    {keepCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{keepCopied ? 'Copied' : 'Copy Items'}</span>
                  </button>
                </div>

                <div className="space-y-1.5 text-xs text-slate-300">
                  {keepNote.items?.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 rounded-sm border border-yellow-500/80 bg-yellow-500/10 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5 text-yellow-400" />
                      </div>
                      <span className="text-[12px]">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: Google Chat */}
          {activeTab === 'chat' && (
            <div className="space-y-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-purple-400" />
                    Google Chat Team Spaces
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Send real-time notifications, lesson review summaries, and co-teaching alerts to your department or grade-level team Google Chat spaces.
                  </p>
                </div>
                <button
                  onClick={fetchChatSpaces}
                  disabled={loadingAction === 'chat_spaces'}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingAction === 'chat_spaces' ? 'animate-spin' : ''}`} />
                  <span>Refresh Spaces</span>
                </button>
              </div>

              <div className="p-5 rounded-xl bg-slate-800/60 border border-slate-700 space-y-4">
                {chatSpaces.length > 0 ? (
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Select Google Chat Space</label>
                    <select
                      value={selectedSpaceName}
                      onChange={(e) => setSelectedSpaceName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-hidden focus:border-purple-500"
                    >
                      {chatSpaces.map((s) => (
                        <option key={s.name} value={s.name}>
                          {s.displayName || s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="p-3 rounded-lg bg-purple-950/30 border border-purple-800/50 text-[11px] text-purple-200">
                    💡 If your Google Chat space is in an enterprise workspace, ensure the Chat App is activated on Google Cloud Console for your project. You can still customize your team announcement below!
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Collaboration Message</label>
                  <textarea
                    rows={3}
                    value={customChatMessage}
                    onChange={(e) => setCustomChatMessage(e.target.value)}
                    placeholder={`[UDL Lesson Plan Shared] "${lesson.title}" (${lesson.gradeLevel}) - Firm Goal: ${lesson.learningGoal}`}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-purple-500"
                  />
                </div>

                <div className="flex items-center justify-end">
                  <button
                    onClick={handleSendChatMessage}
                    disabled={loadingAction === 'chat_send' || (!selectedSpaceName && chatSpaces.length > 0)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {loadingAction === 'chat_send' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    Send to Google Chat
                  </button>
                </div>
              </div>

              {chatSentSuccess && (
                <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-800/80 flex items-center justify-between">
                  <div className="text-xs text-purple-300 font-semibold">Message delivered to Google Chat space!</div>
                  <a
                    href="https://chat.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold"
                  >
                    <span>Open Google Chat</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Google Workspace Ecosystem Connected</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

        {/* Mandatory Confirmation Modal for Mutating/Destructive operations */}
        {pendingConfirmation && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
            <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/30">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">{pendingConfirmation.actionTitle}</h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {pendingConfirmation.description}
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700 text-[11px] text-slate-400">
                This operation will interact directly with your connected Google Workspace account on your behalf.
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setPendingConfirmation(null)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    const cb = pendingConfirmation.onConfirm;
                    setPendingConfirmation(null);
                    await cb();
                  }}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Confirm & Proceed
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
