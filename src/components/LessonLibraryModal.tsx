import React, { useState } from 'react';
import { X, BookOpen, Plus, Search, Calendar, CheckCircle2, ChevronRight, Bookmark } from 'lucide-react';
import { LessonPlan } from '../types/lesson';
import { demoLesson } from '../data/demoLesson';

interface LessonLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLesson: (lesson: LessonPlan) => void;
}

const SAMPLE_LESSONS: LessonPlan[] = [
  demoLesson,
  {
    ...demoLesson,
    id: 'lesson-math-802',
    title: 'Linear Functions: Rate of Change & Proportionality',
    subject: 'Mathematics',
    gradeLevel: 'Grade 8',
    unit: 'Linear Relationships',
    duration: '45 minutes',
    learningGoal: 'Students will determine and interpret the rate of change and initial value of a linear relationship from two points, a table, or a graph.',
    clearScoreAverage: 19.5,
    status: 'ready',
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    ...demoLesson,
    id: 'lesson-ela-903',
    title: 'Analyzing Rhetorical Devices in Historical Speeches',
    subject: 'English Language Arts',
    gradeLevel: 'Grade 9',
    unit: 'Persuasive Discourse',
    duration: '60 minutes',
    learningGoal: 'Students will analyze how an author uses rhetorical appeals (ethos, pathos, logos) to advance a central claim, providing textual citations.',
    clearScoreAverage: 18.8,
    status: 'ready',
    updatedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    ...demoLesson,
    id: 'lesson-cs-101',
    title: 'Algorithmic Thinking & Decomposition',
    subject: 'Computer Science',
    gradeLevel: 'Grade 7',
    unit: 'Computational Problem Solving',
    duration: '60 minutes',
    learningGoal: 'Students will decompose a complex daily process into sequential algorithmic steps with clear conditional logic.',
    clearScoreAverage: 19.1,
    status: 'ready',
    updatedAt: new Date(Date.now() - 86400000 * 8).toISOString(),
  }
];

export const LessonLibraryModal: React.FC<LessonLibraryModalProps> = ({
  isOpen,
  onClose,
  onSelectLesson,
}) => {
  const [search, setSearch] = useState('');
  const [filterSubject, setFilterSubject] = useState('All');

  if (!isOpen) return null;

  const filtered = SAMPLE_LESSONS.filter((l) => {
    const matchesSearch = l.title.toLowerCase().includes(search.toLowerCase()) || 
                          l.learningGoal.toLowerCase().includes(search.toLowerCase());
    const matchesSubject = filterSubject === 'All' || l.subject === filterSubject;
    return matchesSearch && matchesSubject;
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-3xl w-full max-h-[88vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Lesson Library & Exemplar Templates
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Grounded in CAST UDL Guidelines 3.0 with verified CLEAR alignment.
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

        {/* Filter bar */}
        <div className="p-4 border-b border-slate-100 bg-white flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by topic, standard, or goal..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <select
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none"
          >
            <option value="All">All Subjects</option>
            <option value="Science">Science</option>
            <option value="Mathematics">Mathematics</option>
            <option value="English Language Arts">English Language Arts</option>
            <option value="Computer Science">Computer Science</option>
          </select>
        </div>

        {/* Lesson List */}
        <div className="p-4 space-y-3 overflow-y-auto flex-1">
          {filtered.map((les) => (
            <div
              key={les.id}
              onClick={() => {
                onSelectLesson(les);
                onClose();
              }}
              className="p-4 rounded-xl border border-slate-200 hover:border-orange-400 bg-white hover:bg-orange-50/20 transition-all cursor-pointer group shadow-2xs"
            >
              <div className="flex items-start justify-between gap-3 mb-1.5">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700">
                      {les.subject}
                    </span>
                    <span className="text-[11px] font-bold text-slate-500">
                      {les.gradeLevel} • {les.unit}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                    {les.title}
                  </h3>
                </div>

                <div className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 text-xs font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>CLEAR {les.clearScoreAverage}/20</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 line-clamp-2 mb-2 font-medium">
                <strong>Goal:</strong> {les.learningGoal}
              </p>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                <span>{les.duration} • {les.classSize}</span>
                <span className="text-orange-600 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  <span>Load Lesson</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>{filtered.length} lesson plans available</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
