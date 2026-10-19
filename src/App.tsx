import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar, NavItem } from './components/Sidebar';
import { HeroBanner } from './components/HeroBanner';
import { Stepper } from './components/Stepper';
import { LessonInfoForm } from './components/LessonInfoForm';
import { LearningGoalCard } from './components/LearningGoalCard';
import { BarriersCard } from './components/BarriersCard';
import { UdlOptionsGrid } from './components/UdlOptionsGrid';
import { AiVisionCard } from './components/AiVisionCard';
import { ClearReviewCard } from './components/ClearReviewCard';
import { BottomActionBar } from './components/BottomActionBar';

// Modals
import { UdlOptionsModal } from './components/UdlOptionsModal';
import { VisionStudioModal } from './components/VisionStudioModal';
import { ImageGenModal } from './components/ImageGenModal';
import { A2AJudgeModal } from './components/A2AJudgeModal';
import { UdlCoDesignerChat } from './components/UdlCoDesignerChat';
import { LessonPreviewModal } from './components/LessonPreviewModal';
import { WorkspaceShareModal } from './components/WorkspaceShareModal';
import { LessonLibraryModal } from './components/LessonLibraryModal';
import { ThreeDLabModal } from './components/ThreeDLabModal';
import { AudioTranscribeModal } from './components/AudioTranscribeModal';
import { AccessibilityReportModal } from './components/AccessibilityReportModal';
import { AchievementManager } from './components/AchievementManager';
import { CollaborativeWhiteboard } from './components/CollaborativeWhiteboard';
import { CalendarIntegrationManager } from './components/CalendarIntegrationManager';
import { GoogleWorkspaceHubModal, WorkspaceTab } from './components/GoogleWorkspaceHubModal';
import { AuthModal, AuthMode } from './components/AuthModal';
import { syncManager } from './utils/dataSyncManager';
import { AuthUserProfile, getStoredUserProfile, subscribeToAuth, signOutUser } from './utils/authService';

import { demoLesson } from './data/demoLesson';
import { LessonPlan, UdlOption, UdlPrinciple } from './types/lesson';

export default function App() {
  const [activeNav, setActiveNav] = useState<NavItem>('dashboard');
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [currentUser, setCurrentUser] = useState<AuthUserProfile | null>(getStoredUserProfile);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<AuthMode>('sign_in');

  const [lesson, setLesson] = useState<LessonPlan>(() => {
    const cached = syncManager.getCachedLesson();
    return cached || demoLesson;
  });

  useEffect(() => {
    const unsub = subscribeToAuth((u) => {
      setCurrentUser(u);
    });
    return () => {
      if (typeof unsub === 'function') unsub();
    };
  }, []);

  // Modal visibility states
  const [isOptionsModalOpen, setIsOptionsModalOpen] = useState(false);
  const [selectedPrinciple, setSelectedPrinciple] = useState<UdlPrinciple>('representation');
  const [isVisionStudioOpen, setIsVisionStudioOpen] = useState(false);
  const [isThreeDLabOpen, setIsThreeDLabOpen] = useState(false);
  const [isAudioTranscribeOpen, setIsAudioTranscribeOpen] = useState(false);
  const [isAccessibilityModalOpen, setIsAccessibilityModalOpen] = useState(false);
  const [isImageGenOpen, setIsImageGenOpen] = useState(false);
  const [isA2AJudgeOpen, setIsA2AJudgeOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isWhiteboardOpen, setIsWhiteboardOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);
  const [workspaceInitialTab, setWorkspaceInitialTab] = useState<WorkspaceTab>('meet');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleOpenWorkspace = (tab: WorkspaceTab = 'meet') => {
    setWorkspaceInitialTab(tab);
    setIsWorkspaceOpen(true);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenAuth = (mode: AuthMode = 'sign_in') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleSignOut = async () => {
    await signOutUser();
    setCurrentUser(null);
    showToast('Signed out of educator account.');
  };

  const handleAuthSuccess = (user: AuthUserProfile, message: string) => {
    setCurrentUser(user);
    showToast(message);
  };

  const handleDeleteOption = (principle: UdlPrinciple, id: string) => {
    setLesson((prev) => {
      let removedTitle = '';
      const filterOut = (list: UdlOption[]) =>
        list.filter((o) => {
          if (o.id === id) {
            removedTitle = o.title;
            return false;
          }
          return true;
        });

      const updated = {
        ...prev,
        engagementOptions: principle === 'engagement' ? filterOut(prev.engagementOptions) : prev.engagementOptions,
        representationOptions: principle === 'representation' ? filterOut(prev.representationOptions) : prev.representationOptions,
        actionExpressionOptions: principle === 'action_expression' ? filterOut(prev.actionExpressionOptions) : prev.actionExpressionOptions,
      };

      if (removedTitle) {
        showToast(`Deleted option: "${removedTitle}"`);
      }
      return updated;
    });
  };

  const handleDownloadPdf = () => {
    setIsPreviewOpen(true);
    setTimeout(() => {
      window.print();
    }, 500);
  };

  // Nav actions
  const handleSelectNav = (item: NavItem) => {
    setActiveNav(item);
    switch (item) {
      case 'dashboard':
        break;
      case 'create_lesson':
        handleResetLesson();
        showToast('Created fresh lesson draft.');
        break;
      case 'udl_codesigner':
        setIsChatOpen(true);
        break;
      case 'workspace_suite':
        handleOpenWorkspace('meet');
        break;
      case 'google_meet':
        handleOpenWorkspace('meet');
        break;
      case 'google_slides':
        handleOpenWorkspace('slides');
        break;
      case 'google_classroom':
        handleOpenWorkspace('classroom');
        break;
      case 'google_docs':
        handleOpenWorkspace('docs');
        break;
      case 'google_keep':
        handleOpenWorkspace('keep');
        break;
      case 'google_chat':
        handleOpenWorkspace('chat');
        break;
      case 'whiteboard':
        setIsWhiteboardOpen(true);
        break;
      case 'calendar_schedule':
        setIsCalendarOpen(true);
        break;
      case 'lesson_library':
      case 'my_lessons':
        setIsLibraryOpen(true);
        break;
      case 'standards':
        showToast('Viewing NGSS & State Learning Standards.');
        break;
      case 'three_d_lab':
        setIsThreeDLabOpen(true);
        break;
      case 'audio_transcribe':
        setIsAudioTranscribeOpen(true);
        break;
      case 'resources':
        setIsImageGenOpen(true);
        break;
      case 'image_analysis':
        setIsVisionStudioOpen(true);
        break;
      case 'accessibility_report':
        setIsAccessibilityModalOpen(true);
        break;
      case 'clear_review':
        setIsOptionsModalOpen(true);
        break;
      case 'a2a_judge':
        setIsA2AJudgeOpen(true);
        break;
      case 'export_share':
        setIsPreviewOpen(true);
        break;
      case 'settings':
        showToast('Settings: WCAG 2.2 AA Contrast High, Auto-drift alert enabled.');
        break;
      case 'help':
        setIsChatOpen(true);
        break;
    }
  };

  const handleTriggerVisionTool = (tool: 'recognition' | 'detection' | 'analysis' | 'generate') => {
    setIsVisionStudioOpen(true);
  };

  const handleHeroQuickAction = (action: 'ideas' | 'images' | 'options' | 'clear' | 'export') => {
    switch (action) {
      case 'ideas':
        setIsChatOpen(true);
        break;
      case 'images':
        setIsVisionStudioOpen(true);
        break;
      case 'options':
        setSelectedPrinciple('engagement');
        setIsOptionsModalOpen(true);
        break;
      case 'clear':
        setIsA2AJudgeOpen(true);
        break;
      case 'export':
        setIsPreviewOpen(true);
        break;
    }
  };

  const handleResetLesson = () => {
    setLesson({
      ...demoLesson,
      id: `lesson-${Date.now()}`,
      title: 'New UDL Lesson Plan',
      learningGoal: 'Students will demonstrate understanding of the key relationship using evidence.',
      learningStandard: 'State learning standard objective...',
    });
    setCurrentStep(1);
    showToast('Lesson information reset to blank template.');
  };

  const handleUpdateLesson = (updated: Partial<LessonPlan>) => {
    setLesson((prev) => {
      const next = { ...prev, ...updated };
      syncManager.saveLesson(next);
      return next;
    });
  };

  const handleToggleBarrier = (id: string) => {
    setLesson((prev) => ({
      ...prev,
      barriers: prev.barriers.map((b) => (b.id === id ? { ...b, active: !b.active } : b)),
    }));
  };

  const handleAddBarrier = (label: string) => {
    setLesson((prev) => ({
      ...prev,
      barriers: [
        ...prev.barriers,
        { id: `b-${Date.now()}`, category: 'General', label, active: true },
      ],
    }));
    showToast(`Added barrier: "${label}"`);
  };

  const handleRemoveBarrier = (id: string) => {
    setLesson((prev) => ({
      ...prev,
      barriers: prev.barriers.filter((b) => b.id !== id),
    }));
  };

  const handleOpenPrinciple = (principle: UdlPrinciple) => {
    setSelectedPrinciple(principle);
    setIsOptionsModalOpen(true);
  };

  const handleToggleOptionInModal = (id: string) => {
    setLesson((prev) => {
      const updateOptions = (opts: UdlOption[]) =>
        opts.map((o) => (o.id === id ? { ...o, selected: !o.selected } : o));
      return {
        ...prev,
        engagementOptions: updateOptions(prev.engagementOptions),
        representationOptions: updateOptions(prev.representationOptions),
        actionExpressionOptions: updateOptions(prev.actionExpressionOptions),
      };
    });
  };

  const handleAddOptionFromModal = (option: UdlOption) => {
    setLesson((prev) => {
      if (option.principle === 'engagement') {
        return { ...prev, engagementOptions: [option, ...prev.engagementOptions] };
      }
      if (option.principle === 'representation') {
        return { ...prev, representationOptions: [option, ...prev.representationOptions] };
      }
      return { ...prev, actionExpressionOptions: [option, ...prev.actionExpressionOptions] };
    });
    showToast(`Added UDL Option: "${option.title}"`);
  };

  const getActiveOptionsList = () => {
    switch (selectedPrinciple) {
      case 'engagement':
        return lesson.engagementOptions;
      case 'representation':
        return lesson.representationOptions;
      case 'action_expression':
        return lesson.actionExpressionOptions;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800 antialiased selection:bg-orange-500 selection:text-white">
      
      {/* Top Header */}
      <Header
        onSearch={(q) => showToast(`Searching lessons for: "${q}"`)}
        onOpenNotifications={() => setIsA2AJudgeOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenAccessibilityReport={() => setIsAccessibilityModalOpen(true)}
        onOpenWorkspace={() => handleOpenWorkspace('meet')}
        currentUser={currentUser}
        onOpenAuth={handleOpenAuth}
        onSignOut={handleSignOut}
      />

      {/* Main Workspace Frame with Left-Hand Single Panel */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Side Single Panel containing all buttons */}
        <Sidebar
          activeItem={activeNav}
          onSelectItem={handleSelectNav}
          onTriggerVisionTool={handleTriggerVisionTool}
          onOpenProfile={() => setIsProfileOpen(true)}
          onOpenWorkspace={handleOpenWorkspace}
          currentUser={currentUser}
          onOpenAuth={handleOpenAuth}
          onSignOut={handleSignOut}
        />

        {/* Center Main Content Scrollable Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-7 max-w-[1720px] mx-auto w-full">
          
          {/* Top Hero Banner matching replica */}
          <HeroBanner onQuickAction={handleHeroQuickAction} />

          {/* 6-Step Stepper bar matching replica */}
          <Stepper currentStep={currentStep} onSelectStep={(st) => setCurrentStep(st)} />

          {/* Main 3-Column Grid Matching Screenshot Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            
            {/* Column 1: Lesson Information (Width: 4 Cols on lg, or 5 on xl) */}
            <div className="lg:col-span-4 xl:col-span-4">
              <LessonInfoForm
                lesson={lesson}
                onChange={handleUpdateLesson}
                onReset={handleResetLesson}
                onNext={() => {
                  setCurrentStep(2);
                  showToast('Advancing to Step 2: Learning Goal Definition');
                }}
              />
            </div>

            {/* Column 2: Center Cards (Width: 5 Cols on lg) */}
            <div className="lg:col-span-5 xl:col-span-5 space-y-4">
              
              {/* Card 2: Learning Goal */}
              <LearningGoalCard
                goal={lesson.learningGoal}
                onUpdateGoal={(newGoal) => handleUpdateLesson({ learningGoal: newGoal })}
                standard={lesson.learningStandard}
              />

              {/* Card 3: Anticipated Barriers */}
              <BarriersCard
                barriers={lesson.barriers}
                onToggleBarrier={handleToggleBarrier}
                onAddBarrier={handleAddBarrier}
                onRemoveBarrier={handleRemoveBarrier}
                subject={lesson.subject}
                gradeLevel={lesson.gradeLevel}
                learningGoal={lesson.learningGoal}
              />

              {/* Card 4: UDL Options Generated by AI */}
              <UdlOptionsGrid
                engagementOptions={lesson.engagementOptions}
                representationOptions={lesson.representationOptions}
                actionExpressionOptions={lesson.actionExpressionOptions}
                onOpenPrincipleModal={handleOpenPrinciple}
                onOpenWhiteboard={() => setIsWhiteboardOpen(true)}
                onDeleteOption={handleDeleteOption}
              />
            </div>

            {/* Column 3: Right Side Cards (Width: 3 Cols on lg) */}
            <div className="lg:col-span-3 xl:col-span-3 space-y-4">
              
              {/* Card 5: AI Vision Tools */}
              <AiVisionCard
                onVisionResult={(resText) => {
                  showToast('Image recognition completed.');
                }}
                onOpenFullVisionStudio={() => setIsVisionStudioOpen(true)}
              />

              {/* Card 6: CLEAR Review */}
              <ClearReviewCard
                onOpenClearDetails={() => {
                  setSelectedPrinciple('representation');
                  setIsOptionsModalOpen(true);
                }}
              />
            </div>

          </div>

          {/* Bottom Full-width Action Bar */}
          <BottomActionBar
            onPreview={() => setIsPreviewOpen(true)}
            onDownloadPdf={handleDownloadPdf}
            onPrint={() => window.print()}
            onSaveToLibrary={() => {
              showToast('Lesson saved to district library successfully!');
            }}
            onShare={() => setIsShareOpen(true)}
            onScheduleCalendar={() => setIsCalendarOpen(true)}
            onOpenWorkspace={handleOpenWorkspace}
          />

        </main>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl border border-slate-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modals & Dialogs */}
      <UdlOptionsModal
        isOpen={isOptionsModalOpen}
        onClose={() => setIsOptionsModalOpen(false)}
        principle={selectedPrinciple}
        options={getActiveOptionsList()}
        learningGoal={lesson.learningGoal}
        barriers={lesson.barriers.filter((b) => b.active).map((b) => b.label)}
        onToggleOption={handleToggleOptionInModal}
        onAddOption={handleAddOptionFromModal}
        onDeleteOption={(id) => handleDeleteOption(selectedPrinciple, id)}
      />

      <VisionStudioModal
        isOpen={isVisionStudioOpen}
        onClose={() => setIsVisionStudioOpen(false)}
        onAddUdlOption={handleAddOptionFromModal}
      />

      <ThreeDLabModal
        isOpen={isThreeDLabOpen}
        onClose={() => setIsThreeDLabOpen(false)}
        onAddUdlOption={handleAddOptionFromModal}
      />

      <AudioTranscribeModal
        isOpen={isAudioTranscribeOpen}
        onClose={() => setIsAudioTranscribeOpen(false)}
        onInsertTranscription={(txt) => {
          showToast('Live audio transcription inserted into lesson assessment notes.');
        }}
      />

      <AccessibilityReportModal
        isOpen={isAccessibilityModalOpen}
        onClose={() => setIsAccessibilityModalOpen(false)}
        lesson={lesson}
      />

      <ImageGenModal
        isOpen={isImageGenOpen}
        onClose={() => setIsImageGenOpen(false)}
        onInsertImageIntoLesson={(url) => {
          showToast('Image asset attached to UDL lesson representation materials.');
        }}
      />

      <A2AJudgeModal
        isOpen={isA2AJudgeOpen}
        onClose={() => setIsA2AJudgeOpen(false)}
        lesson={lesson}
      />

      <UdlCoDesignerChat
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        currentGoal={lesson.learningGoal}
      />

      <LessonPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        lesson={lesson}
      />

      <WorkspaceShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        lesson={lesson}
      />

      <LessonLibraryModal
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        onSelectLesson={(selected) => {
          setLesson(selected);
          showToast(`Loaded lesson: "${selected.title}"`);
        }}
      />

      <AchievementManager
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        totalLessons={10}
        currentUser={currentUser}
        onChangePassword={() => handleOpenAuth('change_password')}
        onSignOut={handleSignOut}
        onSignIn={() => handleOpenAuth('sign_in')}
      />

      <CollaborativeWhiteboard
        isOpen={isWhiteboardOpen}
        onClose={() => setIsWhiteboardOpen(false)}
        onAttachDiagramAsOption={(newOption) => {
          handleAddOptionFromModal(newOption);
          showToast(`Attached pathway diagram as UDL option: "${newOption.title}"`);
        }}
      />

      <CalendarIntegrationManager
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        lesson={lesson}
        onScheduledSuccess={(ev) => {
          showToast(`Scheduled "${ev.lesson}" for ${ev.date} via Google Calendar!`);
        }}
      />

      <GoogleWorkspaceHubModal
        isOpen={isWorkspaceOpen}
        onClose={() => setIsWorkspaceOpen(false)}
        lesson={lesson}
        initialTab={workspaceInitialTab}
      />

      {/* Auth Modal for Sign Up, Sign In, Sign Out, and Change Password at any time */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
        currentUser={currentUser}
        onAuthSuccess={handleAuthSuccess}
        onSignOut={handleSignOut}
      />

    </div>
  );
}
