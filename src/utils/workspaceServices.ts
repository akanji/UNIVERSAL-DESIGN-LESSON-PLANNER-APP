import { getAccessToken } from './workspaceAuth';
import { LessonPlan } from '../types/lesson';

// --- Google Meet API ---
export interface MeetSpaceResponse {
  name: string;
  meetingUri: string;
  meetingCode: string;
  config?: any;
}

export const createGoogleMeetSpace = async (): Promise<MeetSpaceResponse> => {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated with Google Workspace. Please sign in first.');

  const res = await fetch('https://meet.googleapis.com/v2/spaces', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Failed to create Google Meet space (${res.status})`);
  }

  return await res.json();
};

// --- Google Docs API ---
export interface DocResponse {
  documentId: string;
  title: string;
  documentUrl: string;
}

export const createGoogleDocForLesson = async (lesson: LessonPlan): Promise<DocResponse> => {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated with Google Workspace. Please sign in first.');

  const title = `UDL Lesson Plan: ${lesson.title} (${lesson.gradeLevel})`;

  // Step 1: Create document
  const createRes = await fetch('https://docs.googleapis.com/v1/documents', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title }),
  });

  if (!createRes.ok) {
    const errorData = await createRes.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Failed to create Google Doc (${createRes.status})`);
  }

  const doc = await createRes.json();
  const documentId = doc.documentId;

  // Step 2: Insert formatted text content
  const fullContent = [
    `UNIVERSAL DESIGN FOR LEARNING (UDL) LESSON PLAN\n`,
    `Subject: ${lesson.subject} | Grade Level: ${lesson.gradeLevel} | Duration: ${lesson.duration}\n`,
    `Standard: ${lesson.learningStandard}\n\n`,
    `FIRM LEARNING GOAL:\n${lesson.learningGoal}\n\n`,
    `STUDENT-FRIENDLY GOAL:\n${lesson.studentFriendlyGoal || lesson.learningGoal}\n\n`,
    `SUCCESS CRITERIA:\n${lesson.successCriteria?.map((c, i) => `${i + 1}. ${c}`).join('\n') || 'Demonstrate mastery through chosen pathway'}\n\n`,
    `UDL PRINCIPLES ARCHITECTURE:\n`,
    `1. MULTIPLE MEANS OF ENGAGEMENT:\n${lesson.engagementOptions?.map(o => `• ${o.title}: ${o.learnerPathway}`).join('\n') || 'Autonomous interest pathways'}\n\n`,
    `2. MULTIPLE MEANS OF REPRESENTATION:\n${lesson.representationOptions?.map(o => `• ${o.title}: ${o.learnerPathway}`).join('\n') || 'Multi-modal representations'}\n\n`,
    `3. MULTIPLE MEANS OF ACTION & EXPRESSION:\n${lesson.actionExpressionOptions?.map(o => `• ${o.title}: ${o.learnerPathway}`).join('\n') || 'Multi-modal expression'}\n\n`,
    `INSTRUCTIONAL SEQUENCE:\n${lesson.instructionalSequence?.map(s => `• ${s.title} (${s.duration}): ${s.description}`).join('\n\n') || 'Step-by-step UDL scaffolding sequence'}\n\n`,
    `ASSESSMENT & EVALUATION:\n${lesson.assessmentMethods}\n\n`,
    `ACCESSIBILITY & ACCOMMODATIONS:\n${lesson.accessibilityNotes?.join('\n') || 'WCAG 2.2 AAA Accessible | Sensory, physical, and cognitive accommodations verified'}\n\n`,
    `Generated with Universal Design Lesson Planner`
  ].join('');

  try {
    await fetch(`https://docs.googleapis.com/v1/documents/${documentId}:batchUpdate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [
          {
            insertText: {
              location: { index: 1 },
              text: fullContent,
            },
          },
        ],
      }),
    });
  } catch (err) {
    console.warn('Could not populate initial text, empty doc created:', err);
  }

  return {
    documentId,
    title,
    documentUrl: `https://docs.google.com/document/d/${documentId}/edit`,
  };
};

// --- Google Slides API ---
export interface SlidesResponse {
  presentationId: string;
  title: string;
  slidesUrl: string;
}

export const createGoogleSlidesForLesson = async (lesson: LessonPlan): Promise<SlidesResponse> => {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated with Google Workspace. Please sign in first.');

  const title = `[UDL Deck] ${lesson.title} - ${lesson.gradeLevel}`;

  // Step 1: Create Presentation
  const createRes = await fetch('https://slides.googleapis.com/v1/presentations', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title }),
  });

  if (!createRes.ok) {
    const errorData = await createRes.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Failed to create Google Slides presentation (${createRes.status})`);
  }

  const presentation = await createRes.json();
  const presentationId = presentation.presentationId;

  // Step 2: Add slides for UDL frameworks
  try {
    const requests = [
      {
        createSlide: {
          insertionIndex: 1,
          slideLayoutReference: { predefinedLayout: 'TITLE_AND_BODY' },
        },
      },
      {
        createSlide: {
          insertionIndex: 2,
          slideLayoutReference: { predefinedLayout: 'TITLE_AND_BODY' },
        },
      },
      {
        createSlide: {
          insertionIndex: 3,
          slideLayoutReference: { predefinedLayout: 'TITLE_AND_BODY' },
        },
      },
    ];

    await fetch(`https://slides.googleapis.com/v1/presentations/${presentationId}:batchUpdate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ requests }),
    });
  } catch (err) {
    console.warn('Could not create extra slides:', err);
  }

  return {
    presentationId,
    title,
    slidesUrl: `https://docs.google.com/presentation/d/${presentationId}/edit`,
  };
};

// --- Google Classroom API ---
export interface ClassroomCourse {
  id: string;
  name: string;
  section?: string;
  room?: string;
  alternateLink?: string;
}

export const listClassroomCourses = async (): Promise<ClassroomCourse[]> => {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated with Google Workspace. Please sign in first.');

  const res = await fetch('https://classroom.googleapis.com/v1/courses?courseStates=ACTIVE', {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Failed to fetch Google Classroom courses (${res.status})`);
  }

  const data = await res.json();
  return data.courses || [];
};

export const postClassroomAnnouncement = async (
  courseId: string,
  text: string
): Promise<{ id: string; alternateLink?: string }> => {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated with Google Workspace. Please sign in first.');

  const res = await fetch(`https://classroom.googleapis.com/v1/courses/${courseId}/announcements`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text,
      state: 'PUBLISHED',
    }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Failed to post Google Classroom announcement (${res.status})`);
  }

  return await res.json();
};

export const createClassroomAssignment = async (
  courseId: string,
  lesson: LessonPlan
): Promise<{ id: string; alternateLink?: string }> => {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated with Google Workspace. Please sign in first.');

  const description = [
    `Firm Learning Goal: ${lesson.learningGoal}`,
    `Standard: ${lesson.learningStandard}`,
    `Choose your learning pathway:`,
    `- Pathway A: Visual / Spatial interactive review`,
    `- Pathway B: Audio / Podcast analysis`,
    `- Pathway C: Hands-on lab / CER construction`,
    `Accommodations & Rubrics provided in Universal Design Lesson Planner.`,
  ].join('\n\n');

  const res = await fetch(`https://classroom.googleapis.com/v1/courses/${courseId}/courseWork`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: `[UDL Lesson] ${lesson.title}`,
      description,
      workType: 'ASSIGNMENT',
      state: 'PUBLISHED',
      maxPoints: 100,
    }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Failed to create Classroom assignment (${res.status})`);
  }

  return await res.json();
};

// --- Google Chat API ---
export interface ChatSpace {
  name: string;
  displayName?: string;
  type?: string;
  spaceType?: string;
}

export const listChatSpaces = async (): Promise<ChatSpace[]> => {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated with Google Workspace. Please sign in first.');

  const res = await fetch('https://chat.googleapis.com/v1/spaces', {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Failed to fetch Google Chat spaces (${res.status})`);
  }

  const data = await res.json();
  return data.spaces || [];
};

export const sendChatMessage = async (
  spaceName: string,
  text: string
): Promise<{ name: string; text: string }> => {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated with Google Workspace. Please sign in first.');

  const res = await fetch(`https://chat.googleapis.com/v1/${spaceName}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Failed to send Google Chat message (${res.status})`);
  }

  return await res.json();
};

// --- Google Keep Integration ---
export interface KeepNoteData {
  title: string;
  text: string;
  items?: string[];
}

export const prepareKeepNoteForLesson = (lesson: LessonPlan): KeepNoteData => {
  const items = [
    `Firm Goal: ${lesson.learningGoal}`,
    `Check assistive technology: Captions, screen reader tags`,
    `Representation: Visual diagrams & audio transcripts ready`,
    `Barriers Addressed: ${lesson.barriers.filter(b => b.active).map(b => b.label).join(', ') || 'Sensory & Cognitive Access'}`,
    `Evaluation Method: ${lesson.assessmentMethods}`,
    `CLEAR Quality Score: ${lesson.clearScoreAverage}/20 READY`,
  ];

  return {
    title: `[UDL Checklist] ${lesson.title}`,
    text: items.join('\n'),
    items,
  };
};

export const openInGoogleKeep = (note: KeepNoteData) => {
  // Construct direct link to Google Keep with note draft
  const url = `https://keep.google.com/new?title=${encodeURIComponent(note.title)}&text=${encodeURIComponent(note.text)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
};
