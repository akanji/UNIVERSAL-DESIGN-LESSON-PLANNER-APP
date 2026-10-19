import React from 'react';
import { RotateCcw, ArrowRight, ArrowLeft } from 'lucide-react';
import { LessonPlan } from '../types/lesson';

interface LessonInfoFormProps {
  lesson: LessonPlan;
  onChange: (updated: Partial<LessonPlan>) => void;
  onReset: () => void;
  onNext: () => void;
}

export const LessonInfoForm: React.FC<LessonInfoFormProps> = ({
  lesson,
  onChange,
  onReset,
  onNext,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
              1
            </div>
            <h2 className="text-sm md:text-base font-bold text-slate-900 tracking-tight">
              Lesson Information
            </h2>
          </div>
          <button
            onClick={onReset}
            type="button"
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 text-xs font-semibold transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3 text-slate-400" />
            <span>Reset</span>
          </button>
        </div>

        {/* Form Grid */}
        <div className="space-y-3.5 text-xs">
          {/* Row: Subject, Grade, Unit */}
          <div className="grid grid-cols-3 gap-2.5">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Subject <span className="text-red-500">*</span>
              </label>
              <select
                value={lesson.subject}
                onChange={(e) => onChange({ subject: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 font-medium focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="Science">Science</option>
                <option value="Mathematics">Mathematics</option>
                <option value="English Language Arts">English Lang. Arts</option>
                <option value="Social Studies">Social Studies</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Visual Arts">Visual Arts</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Grade Level <span className="text-red-500">*</span>
              </label>
              <select
                value={lesson.gradeLevel}
                onChange={(e) => onChange({ gradeLevel: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 font-medium focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="Grade 6">Grade 6</option>
                <option value="Grade 7">Grade 7</option>
                <option value="Grade 8">Grade 8</option>
                <option value="Grade 9">Grade 9</option>
                <option value="Grade 10">Grade 10</option>
                <option value="Grade 11-12">Grade 11-12</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Unit <span className="text-red-500">*</span>
              </label>
              <select
                value={lesson.unit}
                onChange={(e) => onChange({ unit: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 font-medium focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="Ecosystems">Ecosystems</option>
                <option value="Cell Biology">Cell Biology</option>
                <option value="Energy & Matter">Energy & Matter</option>
                <option value="Earth Systems">Earth Systems</option>
                <option value="Genetics">Genetics</option>
              </select>
            </div>
          </div>

          {/* Lesson Title */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Lesson Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={lesson.title}
              onChange={(e) => onChange({ title: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-800 font-medium focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="e.g. Interdependence in Ecosystems"
            />
          </div>

          {/* Duration & Class Size */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Duration
              </label>
              <select
                value={lesson.duration}
                onChange={(e) => onChange({ duration: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 font-medium focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="45 minutes">45 minutes</option>
                <option value="60 minutes">60 minutes</option>
                <option value="75 minutes">75 minutes</option>
                <option value="90 minutes">90 minutes</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Class Size
              </label>
              <select
                value={lesson.classSize}
                onChange={(e) => onChange({ classSize: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 font-medium focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="18 students">18 students</option>
                <option value="24 students">24 students</option>
                <option value="28 students">28 students</option>
                <option value="32 students">32 students</option>
              </select>
            </div>
          </div>

          {/* Learning Standard */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Learning Standard
            </label>
            <textarea
              rows={2}
              value={lesson.learningStandard}
              onChange={(e) => onChange({ learningStandard: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-800 font-medium focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none leading-relaxed resize-none"
            />
          </div>

          {/* Success Criteria */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Success Criteria
            </label>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 space-y-1 text-slate-700 text-[11px]">
              {lesson.successCriteria.map((sc, idx) => (
                <div key={idx} className="flex items-start gap-1.5">
                  <span className="text-blue-500 font-bold">•</span>
                  <span>{sc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Prior Knowledge */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Prior Knowledge
            </label>
            <input
              type="text"
              value={lesson.priorKnowledge}
              onChange={(e) => onChange({ priorKnowledge: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-800 font-medium focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Assessment Methods */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Assessment Methods
            </label>
            <input
              type="text"
              value={lesson.assessmentMethods}
              onChange={(e) => onChange({ assessmentMethods: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-800 font-medium focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Navigation Buttons matching screenshot */}
      <div className="flex items-center justify-between gap-3 pt-5 mt-4 border-t border-slate-100">
        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Previous</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-sm hover:shadow-md transition-all cursor-pointer"
        >
          <span>Next: Learning Goal</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
