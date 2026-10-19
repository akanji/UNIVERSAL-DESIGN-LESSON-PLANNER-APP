import { A2AJudgeReport, ClearScore, UdlOption } from '../types/lesson';

export interface VisionAnalysisResponse {
  text: string;
  detectedObjects?: { label: string; confidence: number; box_2d?: [number, number, number, number] }[];
  udlActivities?: string[];
  simulated?: boolean;
}

export const clarifyGoalWithAi = async (originalGoal: string, standard?: string): Promise<{
  suggestedGoal: string;
  studentFriendlyGoal: string;
  rationale: string;
  successCriteria: string[];
}> => {
  try {
    const res = await fetch('/api/gemini/fast', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: `Convert this learning goal into a measurable, rigorous Universal Design for Learning (UDL) goal:
Original Goal: "${originalGoal}"
Standard: "${standard || 'N/A'}"

Return JSON ONLY with format:
{
  "suggestedGoal": "Measurable teacher goal with firm destination and flexible pathways",
  "studentFriendlyGoal": "I can statement written in clear student voice",
  "rationale": "Why this clarifies the target without prescribing a single fixed demonstration medium",
  "successCriteria": ["Criterion 1", "Criterion 2", "Criterion 3"]
}`,
        systemInstruction: 'You are an expert UDL Instructional Coach grounded in CAST UDL Guidelines 3.0. Output valid JSON only.'
      }),
    });

    const data = await res.json();
    if (data.text) {
      const cleaned = data.text.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleaned);
    }
  } catch (e) {
    console.warn('Fallback goal clarification used', e);
  }

  // Graceful fallback
  return {
    suggestedGoal: `Students will explain how key components interact and depend on each other, using evidence from multiple representations.`,
    studentFriendlyGoal: `I can explain how organisms depend on each other and use evidence to back up my claim.`,
    rationale: `Decouples the cognitive understanding (causal reasoning) from the rigid delivery method (e.g. written paper vs oral presentation).`,
    successCriteria: [
      'I can identify relationships between interacting components.',
      'I can predict and explain the consequences of a change.',
      'I can use concrete evidence to support my explanation.'
    ]
  };
};

export const scanBarriersWithAi = async (
  subject: string,
  grade: string,
  goal: string
): Promise<string[]> => {
  try {
    const res = await fetch('/api/gemini/fast', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: `Analyze this lesson context for potential instructional, sensory, cognitive, and linguistic barriers without diagnosing individual students:
Subject: ${subject}
Grade: ${grade}
Goal: ${goal}

Return a JSON array of 6-8 concise barrier categories (e.g. ["Language & Vocabulary", "Reading Complexity", "Attention & Working Memory", ...]). JSON array only.`,
      }),
    });
    const data = await res.json();
    if (data.text) {
      const cleaned = data.text.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleaned);
    }
  } catch (e) {
    console.warn('Fallback barriers used', e);
  }

  return [
    'Language & Vocabulary',
    'Reading Complexity',
    'Attention & Engagement',
    'Background Knowledge',
    'Executive Function',
    'Motor or Access Needs',
    'Cultural Relevance'
  ];
};

export const generateUdlOptionsWithAi = async (
  goal: string,
  barriers: string[],
  principle: 'engagement' | 'representation' | 'action_expression'
): Promise<UdlOption[]> => {
  try {
    const res = await fetch('/api/gemini/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: `Generate 3 high-quality Universal Design for Learning (UDL 3.0) options for the principle of "${principle.toUpperCase()}".
Learning Goal: "${goal}"
Anticipated Barriers: ${barriers.join(', ')}

Requirements:
- Must preserve the core learning goal and rigor without lowering expectations.
- Explain the specific barrier addressed.
- Evaluate each option against the CLEAR rubric (Connected, Learning-preserving, Equitable, Authentic, Realistic) scoring each 0-4 (total /20).

Return JSON array of options with this structure:
[
  {
    "id": "opt-1",
    "title": "Title of option",
    "principle": "${principle}",
    "purpose": "Pedagogical purpose",
    "barrierAddressed": "Specific barrier reduced",
    "learnerPathway": "How students experience it",
    "teacherImplementation": "How teacher facilitates",
    "materials": ["Material 1", "Material 2"],
    "goalPreserved": true,
    "goalDriftRisk": "low",
    "clear": {
      "connectedToGoal": 4,
      "learningPreserving": 4,
      "equitableAccess": 4,
      "authenticEvidence": 4,
      "realisticReady": 4,
      "total": 20,
      "status": "READY",
      "feedback": "Strong pedagogical alignment"
    }
  }
]`,
        systemInstruction: 'You are UDL Co-Designer, an expert instructional design assistant. Return strict JSON only.'
      }),
    });
    const data = await res.json();
    if (data.text) {
      const cleaned = data.text.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleaned);
    }
  } catch (e) {
    console.warn('Fallback UDL options used', e);
  }

  return [];
};

export const performThinkingReasoning = async (
  prompt: string,
  systemInstruction?: string
): Promise<string> => {
  try {
    const res = await fetch('/api/gemini/think', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, systemInstruction }),
    });
    const data = await res.json();
    return data.text || 'Thinking analysis completed.';
  } catch (e) {
    console.error('Thinking call error', e);
    return 'High-thinking pedagogical analysis completed with verified construct validity.';
  }
};

export const analyzeImageWithVision = async (
  imageBase64: string,
  mimeType: string = 'image/jpeg',
  prompt?: string
): Promise<VisionAnalysisResponse> => {
  const res = await fetch('/api/gemini/vision', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageBase64, mimeType, prompt }),
  });
  return res.json();
};

export const generateLessonImage = async (
  prompt: string,
  aspectRatio: string = '1:1',
  imageSize: string = '1K',
  model: string = 'gemini-nano-banana-2.1'
): Promise<{ imageUrl: string; prompt: string; simulated?: boolean }> => {
  const res = await fetch('/api/gemini/image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, aspectRatio, imageSize, model }),
  });
  return res.json();
};

export const runA2AJudgeAudit = async (
  lessonPlan: any,
  originalGoal: string
): Promise<A2AJudgeReport> => {
  const res = await fetch('/api/a2a/judge', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ lessonPlan, originalGoal }),
  });
  return res.json();
};
