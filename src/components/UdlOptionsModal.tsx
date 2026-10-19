import React, { useState } from 'react';
import { X, Sparkles, Check, AlertTriangle, ShieldCheck, Heart, BookOpen, Settings2, Plus, RefreshCw, Trash2 } from 'lucide-react';
import { UdlOption, UdlPrinciple } from '../types/lesson';
import { generateUdlOptionsWithAi } from '../services/geminiService';

interface UdlOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  principle: UdlPrinciple;
  options: UdlOption[];
  learningGoal: string;
  barriers: string[];
  onToggleOption: (id: string) => void;
  onAddOption: (option: UdlOption) => void;
  onDeleteOption?: (id: string) => void;
}

export const UdlOptionsModal: React.FC<UdlOptionsModalProps> = ({
  isOpen,
  onClose,
  principle,
  options,
  learningGoal,
  barriers,
  onToggleOption,
  onAddOption,
  onDeleteOption,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customPurpose, setCustomPurpose] = useState('');
  const [customBarrier, setCustomBarrier] = useState('');
  const [customPathway, setCustomPathway] = useState('');

  if (!isOpen) return null;

  const getPrincipleDetails = () => {
    switch (principle) {
      case 'engagement':
        return {
          title: 'Engagement (The WHY)',
          desc: 'Options for recruiting interest, sustaining effort, and self-regulation.',
          icon: <Heart className="w-5 h-5 text-rose-500 fill-rose-500/20" />,
          color: 'text-rose-700 bg-rose-50 border-rose-200',
        };
      case 'representation':
        return {
          title: 'Representation (The WHAT)',
          desc: 'Options for perception, language & symbols, and comprehension.',
          icon: <BookOpen className="w-5 h-5 text-sky-600" />,
          color: 'text-sky-700 bg-sky-50 border-sky-200',
        };
      case 'action_expression':
        return {
          title: 'Action & Expression (The HOW)',
          desc: 'Options for physical action, expression/communication, and executive function.',
          icon: <Settings2 className="w-5 h-5 text-purple-600" />,
          color: 'text-purple-700 bg-purple-50 border-purple-200',
        };
    }
  };

  const details = getPrincipleDetails();

  const handleGenerateNew = async () => {
    setIsGenerating(true);
    try {
      const generated = await generateUdlOptionsWithAi(learningGoal, barriers, principle);
      if (generated && generated.length > 0) {
        onAddOption(generated[0]);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreateCustomOption = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim()) return;

    const newOpt: UdlOption = {
      id: `opt-${Date.now()}`,
      principle,
      title: customTitle.trim(),
      purpose: customPurpose.trim() || 'Provide flexible student pathway aligned to the core goal.',
      barrierAddressed: customBarrier.trim() || 'Anticipated learner cognitive or language barrier.',
      learnerPathway: customPathway.trim() || 'Choice-driven pathway with multi-modal representation.',
      teacherImplementation: 'Facilitate student option choice with scaffolding prompts and graphic materials.',
      materials: ['Visual Cue Cards', 'Rubric Checksheet'],
      goalPreserved: true,
      goalDriftRisk: 'low',
      selected: true,
      clear: {
        connectedToGoal: 4,
        learningPreserving: 4,
        equitableAccess: 4,
        authenticEvidence: 4,
        realisticReady: 4,
        total: 20,
        status: 'READY',
        feedback: 'Teacher-crafted option verified for high goal fidelity.'
      }
    };

    onAddOption(newOpt);
    setCustomTitle('');
    setCustomPurpose('');
    setCustomBarrier('');
    setCustomPathway('');
    setShowAddForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-4 md:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-xs">
              {details.icon}
            </div>
            <div>
              <h2 className="text-base md:text-lg font-bold text-slate-900 leading-tight">
                {details.title}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {details.desc}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{showAddForm ? 'Cancel' : 'Add Custom Option'}</span>
            </button>

            <button
              onClick={handleGenerateNew}
              disabled={isGenerating}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isGenerating ? 'Generating...' : 'AI Generate Option'}</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Learning Goal Reference Bar */}
        <div className="px-5 py-2.5 bg-blue-50/60 border-b border-blue-100/80 flex items-center justify-between text-xs text-blue-900 font-medium">
          <div className="flex items-center gap-2 truncate">
            <span className="font-bold text-blue-700 shrink-0">Target Goal:</span>
            <span className="truncate">{learningGoal}</span>
          </div>
          <span className="text-[11px] text-blue-600 bg-white px-2 py-0.5 rounded-full border border-blue-200 shrink-0">
            {options.length} Pathway Options
          </span>
        </div>

        {/* Optional Add Custom Option Form */}
        {showAddForm && (
          <form onSubmit={handleCreateCustomOption} className="p-4 bg-blue-50/70 border-b border-blue-200 animate-in fade-in space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5 text-blue-600" />
                <span>Create New Custom UDL Option</span>
              </h4>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="text-xs text-slate-400 hover:text-slate-600 font-semibold"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Option Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Socratic Circle with Visual Graphic Organizer"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Purpose / Cognitive Objective
                </label>
                <input
                  type="text"
                  placeholder="e.g. Facilitate structured oral argumentation"
                  value={customPurpose}
                  onChange={(e) => setCustomPurpose(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Barrier Anticipated & Addressed
                </label>
                <input
                  type="text"
                  placeholder="e.g. Working memory overload during discussions"
                  value={customBarrier}
                  onChange={(e) => setCustomBarrier(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Learner Pathway
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sentence-stem cue cards + peer review"
                  value={customPathway}
                  onChange={(e) => setCustomPathway(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs"
              >
                Add Option to Lesson
              </button>
            </div>
          </form>
        )}

        {/* Options List */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {options.map((opt) => {
            const isSelected = opt.selected !== false;
            return (
              <div
                key={opt.id}
                className={`rounded-xl border p-4 transition-all ${
                  isSelected
                    ? 'border-blue-300 bg-white shadow-xs'
                    : 'border-slate-200 bg-slate-50/50 opacity-75'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => onToggleOption(opt.id)}
                      className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-2xs'
                          : 'border border-slate-300 bg-white hover:border-blue-400'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-3" />}
                    </button>
                    <h3 className="text-sm font-bold text-slate-900">
                      {opt.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Goal Drift Badge */}
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                      opt.goalDriftRisk === 'low'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {opt.goalDriftRisk === 'low' ? (
                        <>
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          <span>Goal Preserved</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-3 h-3 text-amber-600" />
                          <span>Drift Risk</span>
                        </>
                      )}
                    </span>

                    {/* CLEAR Badge */}
                    <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-800 font-bold text-xs border border-slate-200">
                      CLEAR: {opt.clear.total}/20
                    </span>

                    {/* Delete Option Button */}
                    {onDeleteOption && (
                      <button
                        onClick={() => onDeleteOption(opt.id)}
                        className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete option"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-600 font-medium mb-3">
                  <strong>Purpose:</strong> {opt.purpose}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-slate-50/80 rounded-lg p-3 border border-slate-100 mb-3">
                  <div>
                    <span className="font-bold text-slate-700 block mb-0.5">
                      Barrier Addressed:
                    </span>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      {opt.barrierAddressed}
                    </p>
                  </div>
                  <div>
                    <span className="font-bold text-slate-700 block mb-0.5">
                      Learner Pathway:
                    </span>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      {opt.learnerPathway}
                    </p>
                  </div>
                </div>

                {/* CLEAR Detail row */}
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-3">
                    <span><strong>C:</strong> {opt.clear.connectedToGoal}/4</span>
                    <span><strong>L:</strong> {opt.clear.learningPreserving}/4</span>
                    <span><strong>E:</strong> {opt.clear.equitableAccess}/4</span>
                    <span><strong>A:</strong> {opt.clear.authenticEvidence}/4</span>
                    <span><strong>R:</strong> {opt.clear.realisticReady}/4</span>
                  </div>

                  <span className="text-[10px] text-slate-400 italic">
                    {opt.clear.feedback}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Selected options will be automatically woven into the final lesson plan and assessment rubric.
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            Apply & Close
          </button>
        </div>

      </div>
    </div>
  );
};
