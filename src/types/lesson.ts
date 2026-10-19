export type UdlPrinciple = 'engagement' | 'representation' | 'action_expression';

export interface ClearScore {
  connectedToGoal: number; // 0-4
  learningPreserving: number; // 0-4
  equitableAccess: number; // 0-4
  authenticEvidence: number; // 0-4
  realisticReady: number; // 0-4
  total: number; // 0-20
  status: 'READY' | 'REVIEW' | 'REVISE' | 'REJECT';
  feedback: string;
}

export interface UdlOption {
  id: string;
  title: string;
  principle: UdlPrinciple;
  purpose: string;
  barrierAddressed: string;
  learnerPathway: string;
  teacherImplementation: string;
  materials: string[];
  goalPreserved: boolean;
  goalDriftRisk: 'low' | 'medium' | 'high';
  clear: ClearScore;
  selected?: boolean;
}

export interface Barrier {
  id: string;
  category: string;
  label: string;
  description?: string;
  active: boolean;
}

export interface LessonPlan {
  id: string;
  title: string;
  subject: string;
  gradeLevel: string;
  unit: string;
  duration: string;
  classSize: string;
  learningStandard: string;
  learningGoal: string;
  studentFriendlyGoal?: string;
  successCriteria: string[];
  priorKnowledge: string;
  assessmentMethods: string;
  barriers: Barrier[];
  engagementOptions: UdlOption[];
  representationOptions: UdlOption[];
  actionExpressionOptions: UdlOption[];
  instructionalSequence?: {
    step: string;
    title: string;
    description: string;
    duration: string;
  }[];
  accessibilityNotes?: string[];
  teacherReflection?: string[];
  clearScoreAverage: number;
  status: 'draft' | 'ready' | 'published';
  updatedAt: string;
}

export interface VisionAnalysisResult {
  detectedObjects: {
    label: string;
    confidence: number;
    box_2d?: [number, number, number, number];
  }[];
  academicConcepts: string[];
  perceptualBarriers: string[];
  udlActivities: {
    engagement: string;
    representation: string;
    actionExpression: string;
  };
  altText: string;
  rawText?: string;
}

export interface Annotation {
  id: string;
  sectionId: string;
  sectionTitle: string;
  authorName: string;
  authorRole: string;
  avatar: string;
  text: string;
  createdAt: string;
  resolved: boolean;
}

export interface W3cCheckItem {
  id: string;
  wcagCode: string;
  title: string;
  level: 'A' | 'AA' | 'AAA';
  passed: boolean;
  notes: string;
}

export interface W3cComplianceReport {
  overallScore: number; // 0-100
  complianceLevel: 'WCAG 2.2 AAA' | 'WCAG 2.2 AA' | 'WCAG 2.2 A';
  certificateId: string;
  auditDate: string;
  principles: {
    name: 'Perceivable' | 'Operable' | 'Understandable' | 'Robust';
    score: number;
    passed: boolean;
    description: string;
    checks: W3cCheckItem[];
  }[];
  lessonAccessibilityFeatures: string[];
  plannerSoftwareCompliance: string[];
  recommendations: string[];
}

export interface A2AJudgeReport {
  overallStatus: 'OPTIMAL' | 'ATTENTION_NEEDED' | 'DRIFT_DETECTED' | 'RESOLVED';
  clearScore: number;
  goalPreservationVerdict: 'VERIFIED' | 'PARTIAL_DRIFT' | 'SEVERE_DRIFT';
  judgeExplanation: string;
  selfDebugStepsTaken: string[];
  errorCorrectionLog: {
    issue: string;
    resolution: string;
  }[];
  recommendedUpgradePrompt: string;
}


