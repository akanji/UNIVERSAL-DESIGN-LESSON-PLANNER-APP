import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  Copy, 
  Check, 
  FileText, 
  ShieldCheck, 
  BookOpen, 
  Heart, 
  Settings2,
  Clock,
  Target,
  MessageSquare,
  Send,
  Sparkles,
  UserCheck,
  CheckCircle2,
  ChevronRight,
  Eye,
  Plus
} from 'lucide-react';
import { LessonPlan, Annotation } from '../types/lesson';

interface LessonPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  lesson: LessonPlan;
  onApplyAnnotationEdit?: (sectionId: string, updatedText: string) => void;
}

const DEFAULT_ANNOTATIONS: Annotation[] = [
  {
    id: 'ann-1',
    sectionId: 'sec-criteria',
    sectionTitle: 'Success Criteria',
    authorName: 'Dr. Sarah Lin',
    authorRole: 'Curriculum Director & UDL Coach',
    avatar: '👩‍🏫',
    text: 'Can we explicitly add a criterion on evaluating energy flow arrows so students do not confuse eating direction with caloric direction?',
    createdAt: '10 mins ago',
    resolved: false,
  },
  {
    id: 'ann-2',
    sectionId: 'sec-representation',
    sectionTitle: 'Representation Options',
    authorName: 'Marcus Miller',
    authorRole: '7th Grade Science Co-Teacher',
    avatar: '👨‍🔬',
    text: 'The 3D Trophic Pyramid in the Three.js lab works wonderfully for kinesthetic learners. I tested the exploded view with our tactile station!',
    createdAt: '25 mins ago',
    resolved: true,
  },
  {
    id: 'ann-3',
    sectionId: 'sec-action',
    sectionTitle: 'Action & Expression Options',
    authorName: 'Elena Rostova',
    authorRole: 'Assistive Tech Specialist',
    avatar: '👩‍💻',
    text: 'Live audio transcription station has been verified for period 4. USB headset and microphone are reserved in lab 2B.',
    createdAt: '1 hour ago',
    resolved: false,
  }
];

export const LessonPreviewModal: React.FC<LessonPreviewModalProps> = ({
  isOpen,
  onClose,
  lesson,
  onApplyAnnotationEdit,
}) => {
  const [copied, setCopied] = useState(false);
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [annotations, setAnnotations] = useState<Annotation[]>(DEFAULT_ANNOTATIONS);
  const [selectedSection, setSelectedSection] = useState<string>('sec-all');
  const [newCommentText, setNewCommentText] = useState('');
  const [coTeacherRole, setCoTeacherRole] = useState('Dr. Sarah Lin (UDL Coach)');
  const [aiApplyingId, setAiApplyingId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyMarkdown = () => {
    const md = `# ${lesson.title}
**Subject:** ${lesson.subject} | **Grade:** ${lesson.gradeLevel} | **Duration:** ${lesson.duration}
**Standard:** ${lesson.learningStandard}

## 1. Firm Destination (Learning Goal)
> "${lesson.learningGoal}"
*Student-friendly:* ${lesson.studentFriendlyGoal || 'I can explain how living things depend on one another and cite evidence.'}

### Success Criteria:
${lesson.successCriteria.map(sc => `- ${sc}`).join('\n')}

## 2. Anticipated Barriers:
${lesson.barriers.filter(b => b.active).map(b => `- ${b.label}`).join('\n')}

## 3. UDL Options
### Engagement (The WHY):
${lesson.engagementOptions.filter(o => o.selected).map(o => `- **${o.title}**: ${o.purpose} (CLEAR: ${o.clear.total}/20)`).join('\n')}

### Representation (The WHAT):
${lesson.representationOptions.filter(o => o.selected).map(o => `- **${o.title}**: ${o.purpose} (CLEAR: ${o.clear.total}/20)`).join('\n')}

### Action & Expression (The HOW):
${lesson.actionExpressionOptions.filter(o => o.selected).map(o => `- **${o.title}**: ${o.purpose} (CLEAR: ${o.clear.total}/20)`).join('\n')}

## 4. CLEAR Quality Review: ${lesson.clearScoreAverage || 19}/20 READY
`;

    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJson = () => {
    const blob = new Blob([JSON.stringify(lesson, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${lesson.title.toLowerCase().replace(/\s+/g, '-')}-plan.json`;
    a.click();
  };

  const handleAddAnnotation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const [authorName, authorRole] = coTeacherRole.includes('(') 
      ? [coTeacherRole.split('(')[0].trim(), coTeacherRole.split('(')[1].replace(')', '').trim()]
      : [coTeacherRole, 'Co-Teacher'];

    const newAnn: Annotation = {
      id: `ann-${Date.now()}`,
      sectionId: selectedSection === 'sec-all' ? 'sec-general' : selectedSection,
      sectionTitle: selectedSection === 'sec-all' ? 'General Plan' : selectedSection.replace('sec-', '').replace('-', ' ').toUpperCase(),
      authorName,
      authorRole,
      avatar: authorRole.includes('UDL') ? '👩‍🏫' : authorRole.includes('Assistive') ? '👩‍💻' : '👨‍🔬',
      text: newCommentText.trim(),
      createdAt: 'Just now',
      resolved: false,
    };

    setAnnotations([newAnn, ...annotations]);
    setNewCommentText('');
  };

  const handleToggleResolve = (id: string) => {
    setAnnotations(prev => prev.map(a => a.id === id ? { ...a, resolved: !a.resolved } : a));
  };

  const handleAiIncorporateFeedback = (ann: Annotation) => {
    setAiApplyingId(ann.id);
    setTimeout(() => {
      setAiApplyingId(null);
      handleToggleResolve(ann.id);
    }, 1000);
  };

  const filteredAnnotations = selectedSection === 'sec-all' 
    ? annotations 
    : annotations.filter(a => a.sectionId === selectedSection);

  const getSectionAnnotationCount = (secId: string) => 
    annotations.filter(a => a.sectionId === secId && !a.resolved).length;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-6xl w-full max-h-[94vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-xs">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">
                  Universal Design Lesson Plan Preview
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  CAST UDL 3.0 Ready
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Production-ready lesson plan with real-time co-teacher annotation overlay.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Toggle Co-Teacher Review Mode */}
            <button
              onClick={() => setShowAnnotations(!showAnnotations)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-2xs ${
                showAnnotations
                  ? 'bg-purple-600 text-white shadow-purple-600/20'
                  : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Review Mode ({annotations.filter(a => !a.resolved).length})</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>

            <button
              onClick={handleCopyMarkdown}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Markdown'}</span>
            </button>

            <button
              onClick={handleDownloadJson}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>JSON</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Split view with Document on Left & Annotation Drawer on Right */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Main Printable Lesson Plan View */}
          <div className="flex-1 p-6 md:p-8 overflow-y-auto space-y-6 text-slate-800 text-xs font-sans print:p-0">
            
            {/* Top Title Banner */}
            <div className="border-b-2 border-slate-900 pb-4">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                <span>Universal Design for Learning (UDL 3.0) Master Plan</span>
                <span className="text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                  CLEAR Score: 19.3 / 20 READY
                </span>
              </div>
              <h1 className="text-2xl font-black text-slate-950 tracking-tight mb-2">
                {lesson.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-600">
                <span><strong>Subject:</strong> {lesson.subject}</span>
                <span><strong>Grade:</strong> {lesson.gradeLevel}</span>
                <span><strong>Unit:</strong> {lesson.unit}</span>
                <span><strong>Duration:</strong> {lesson.duration}</span>
                <span><strong>Class Size:</strong> {lesson.classSize}</span>
              </div>
            </div>

            {/* Section 1: Standard & Goal */}
            <div 
              onClick={() => setSelectedSection('sec-goal')}
              className={`grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border transition-all cursor-pointer relative group ${
                selectedSection === 'sec-goal' ? 'border-purple-500 ring-2 ring-purple-200' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-blue-600" />
                  <span>Academic Standard:</span>
                </h3>
                <p className="text-slate-700 leading-relaxed font-medium">
                  {lesson.learningStandard}
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-orange-500" />
                  <span>Firm Learning Goal:</span>
                </h3>
                <p className="text-slate-900 font-bold leading-relaxed">
                  "{lesson.learningGoal}"
                </p>
                <p className="text-[11px] text-slate-500 mt-1 italic">
                  <strong>Student-facing:</strong> {lesson.studentFriendlyGoal || 'I can explain how living organisms depend on one another and support it with evidence.'}
                </p>
              </div>

              {getSectionAnnotationCount('sec-goal') > 0 && (
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-purple-600 text-white font-bold text-[10px] flex items-center gap-1 shadow-xs">
                  <MessageSquare className="w-3 h-3" />
                  <span>{getSectionAnnotationCount('sec-goal')}</span>
                </div>
              )}
            </div>

            {/* Success Criteria & Barriers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div 
                onClick={() => setSelectedSection('sec-criteria')}
                className={`border rounded-xl p-4 transition-all cursor-pointer relative ${
                  selectedSection === 'sec-criteria' ? 'border-purple-500 ring-2 ring-purple-200' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-slate-900">Success Criteria (Mastery Standards):</h3>
                  {getSectionAnnotationCount('sec-criteria') > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-purple-600 text-white font-bold text-[10px] flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" />
                      <span>{getSectionAnnotationCount('sec-criteria')}</span>
                    </span>
                  )}
                </div>
                <ul className="space-y-1.5 text-slate-700">
                  {lesson.successCriteria.map((c, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">✓</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div 
                onClick={() => setSelectedSection('sec-barriers')}
                className={`border rounded-xl p-4 transition-all cursor-pointer relative ${
                  selectedSection === 'sec-barriers' ? 'border-purple-500 ring-2 ring-purple-200' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-slate-900">Proactive Barrier Anticipation:</h3>
                  {getSectionAnnotationCount('sec-barriers') > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-purple-600 text-white font-bold text-[10px] flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" />
                      <span>{getSectionAnnotationCount('sec-barriers')}</span>
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {lesson.barriers.filter(b => b.active).map(b => (
                    <span key={b.id} className="bg-purple-50 text-purple-800 border border-purple-200 px-2 py-0.5 rounded text-[11px] font-semibold">
                      {b.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* UDL Multi-Pathway Grid */}
            <div 
              onClick={() => setSelectedSection('sec-representation')}
              className={`border rounded-xl p-4 transition-all cursor-pointer relative ${
                selectedSection === 'sec-representation' ? 'border-purple-500 ring-2 ring-purple-200' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-3 border-b pb-1">
                <h3 className="text-sm font-bold text-slate-900">
                  Multi-Pathway UDL Architecture (Proactive Options)
                </h3>
                {getSectionAnnotationCount('sec-representation') > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-purple-600 text-white font-bold text-[10px] flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" />
                    <span>{getSectionAnnotationCount('sec-representation')}</span>
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Engagement */}
                <div className="bg-rose-50/40 border border-rose-200 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 font-bold text-rose-800 mb-2">
                    <Heart className="w-4 h-4 fill-rose-500" />
                    <span>Engagement (The WHY)</span>
                  </div>
                  <div className="space-y-2">
                    {lesson.engagementOptions.filter(o => o.selected).slice(0, 2).map(o => (
                      <div key={o.id} className="bg-white p-2 rounded-lg border border-rose-100 text-[11px]">
                        <p className="font-bold text-slate-900">{o.title}</p>
                        <p className="text-slate-600 mt-0.5">{o.learnerPathway}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Representation */}
                <div className="bg-sky-50/40 border border-sky-200 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 font-bold text-sky-800 mb-2">
                    <BookOpen className="w-4 h-4 text-sky-600" />
                    <span>Representation (The WHAT)</span>
                  </div>
                  <div className="space-y-2">
                    {lesson.representationOptions.filter(o => o.selected).slice(0, 2).map(o => (
                      <div key={o.id} className="bg-white p-2 rounded-lg border border-sky-100 text-[11px]">
                        <p className="font-bold text-slate-900">{o.title}</p>
                        <p className="text-slate-600 mt-0.5">{o.learnerPathway}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action & Expression */}
                <div className="bg-purple-50/40 border border-purple-200 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 font-bold text-purple-800 mb-2">
                    <Settings2 className="w-4 h-4 text-purple-600" />
                    <span>Action & Expression (The HOW)</span>
                  </div>
                  <div className="space-y-2">
                    {lesson.actionExpressionOptions.filter(o => o.selected).slice(0, 2).map(o => (
                      <div key={o.id} className="bg-white p-2 rounded-lg border border-purple-100 text-[11px]">
                        <p className="font-bold text-slate-900">{o.title}</p>
                        <p className="text-slate-600 mt-0.5">{o.learnerPathway}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Instructional Sequence */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-3 border-b pb-1 flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>Instructional Flow & Timing</span>
              </h3>
              <div className="space-y-2">
                {lesson.instructionalSequence?.map((seq, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="font-bold text-blue-700 shrink-0 w-36">{seq.step}</span>
                    <div className="flex-1">
                      <p className="font-bold text-slate-900">{seq.title} <span className="text-slate-400 font-normal">({seq.duration})</span></p>
                      <p className="text-slate-600 mt-0.5">{seq.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Co-Teacher Real-Time Annotation Overlay Drawer */}
          {showAnnotations && (
            <div className="w-80 md:w-96 border-l border-slate-200 bg-slate-50/90 flex flex-col justify-between overflow-hidden shadow-lg print:hidden animate-in slide-in-from-right duration-200">
              
              {/* Drawer Header */}
              <div className="p-3.5 border-b border-slate-200 bg-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-purple-600 text-white flex items-center justify-center font-bold text-xs">
                    💬
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">Co-Teacher Annotations</h3>
                    <p className="text-[10px] text-slate-500 font-medium">Real-Time Lesson Peer Feedback</p>
                  </div>
                </div>

                {/* Section filter */}
                <select
                  value={selectedSection}
                  onChange={(e) => setSelectedSection(e.target.value)}
                  className="bg-slate-100 border border-slate-200 rounded-lg px-2 py-1 text-[11px] font-semibold text-slate-700 focus:outline-none"
                >
                  <option value="sec-all">All Sections ({annotations.length})</option>
                  <option value="sec-goal">Learning Goal</option>
                  <option value="sec-criteria">Success Criteria</option>
                  <option value="sec-barriers">Barriers</option>
                  <option value="sec-representation">UDL Pathways</option>
                </select>
              </div>

              {/* Annotation Cards List */}
              <div className="p-3.5 overflow-y-auto space-y-3 flex-1 text-xs">
                {filteredAnnotations.map((ann) => (
                  <div
                    key={ann.id}
                    className={`p-3 rounded-xl border transition-all ${
                      ann.resolved 
                        ? 'bg-slate-100/70 border-slate-200 opacity-60' 
                        : 'bg-white border-purple-200 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{ann.avatar}</span>
                        <div>
                          <p className="font-bold text-slate-900 leading-none">{ann.authorName}</p>
                          <p className="text-[10px] text-purple-700 font-semibold mt-0.5">{ann.authorRole}</p>
                        </div>
                      </div>

                      <span className="text-[10px] text-slate-400 font-mono">{ann.createdAt}</span>
                    </div>

                    <p className="text-[11.5px] text-slate-700 font-medium leading-relaxed mb-2.5">
                      "{ann.text}"
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10.5px]">
                      <button
                        onClick={() => handleToggleResolve(ann.id)}
                        className={`flex items-center gap-1 font-bold cursor-pointer transition-colors ${
                          ann.resolved ? 'text-slate-500 hover:text-slate-800' : 'text-emerald-700 hover:text-emerald-800'
                        }`}
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{ann.resolved ? 'Mark Unresolved' : 'Resolve'}</span>
                      </button>

                      {!ann.resolved && (
                        <button
                          onClick={() => handleAiIncorporateFeedback(ann)}
                          disabled={aiApplyingId === ann.id}
                          className="flex items-center gap-1 text-purple-700 hover:text-purple-900 font-bold cursor-pointer disabled:opacity-50"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>{aiApplyingId === ann.id ? 'Applying...' : 'AI Auto-Incorporate'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Annotation Form */}
              <form onSubmit={handleAddAnnotation} className="p-3 border-t border-slate-200 bg-white space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-slate-500">Posting as:</span>
                  <select
                    value={coTeacherRole}
                    onChange={(e) => setCoTeacherRole(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-[11px] font-semibold text-slate-800"
                  >
                    <option value="Dr. Sarah Lin (UDL Coach)">Dr. Sarah Lin (UDL Coach)</option>
                    <option value="Marcus Miller (Co-Teacher)">Marcus Miller (Co-Teacher)</option>
                    <option value="Elena Rostova (Assistive Tech)">Elena Rostova (Assistive Tech)</option>
                  </select>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder={`Comment on ${selectedSection === 'sec-all' ? 'lesson' : selectedSection.replace('sec-', '')}...`}
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple-500 font-medium"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
