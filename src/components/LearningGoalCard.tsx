import React, { useState } from 'react';
import { Target, Edit3, Sparkles, Check, AlertCircle, Trash2, Plus } from 'lucide-react';
import { clarifyGoalWithAi } from '../services/geminiService';

interface LearningGoalCardProps {
  goal: string;
  onUpdateGoal: (newGoal: string) => void;
  standard?: string;
}

export const LearningGoalCard: React.FC<LearningGoalCardProps> = ({
  goal,
  onUpdateGoal,
  standard,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draftGoal, setDraftGoal] = useState(goal);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [clarifyFeedback, setClarifyFeedback] = useState<string | null>(null);

  const handleSave = () => {
    onUpdateGoal(draftGoal);
    setIsEditing(false);
  };

  const handleAiClarify = async () => {
    setIsLoadingAi(true);
    try {
      const res = await clarifyGoalWithAi(goal, standard);
      setDraftGoal(res.suggestedGoal);
      onUpdateGoal(res.suggestedGoal);
      setClarifyFeedback(res.rationale);
    } finally {
      setIsLoadingAi(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 transition-all">
      <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-orange-500 text-white font-bold text-xs flex items-center justify-center shadow-xs">
            2
          </div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">
            Learning Goal
          </h3>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleAiClarify}
            disabled={isLoadingAi}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-700 text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
            title="Convert to firm destination with flexible pathways using AI"
          >
            <Sparkles className="w-3 h-3 text-orange-500" />
            <span>{isLoadingAi ? 'Clarifying...' : 'AI Clarify'}</span>
          </button>

          {isEditing && (
            <button
              onClick={() => {
                setDraftGoal('');
                onUpdateGoal('');
              }}
              className="flex items-center gap-1 px-2 py-1 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-colors cursor-pointer"
              title="Clear / Delete Goal"
            >
              <Trash2 className="w-3 h-3 text-rose-500" />
              <span>Clear</span>
            </button>
          )}

          <button
            onClick={() => {
              if (isEditing) handleSave();
              else setIsEditing(true);
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 text-xs font-semibold transition-colors cursor-pointer"
          >
            {isEditing ? <Check className="w-3 h-3 text-emerald-600" /> : <Edit3 className="w-3 h-3 text-slate-400" />}
            <span>{isEditing ? 'Save' : 'Edit'}</span>
          </button>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
          <Target className="w-5 h-5 text-orange-600" />
        </div>

        <div className="flex-1">
          {isEditing ? (
            <textarea
              rows={2}
              value={draftGoal}
              onChange={(e) => setDraftGoal(e.target.value)}
              className="w-full text-xs font-medium text-slate-800 bg-slate-50 border border-slate-300 rounded-lg p-2 focus:bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none resize-none"
            />
          ) : (
            <p className="text-xs md:text-sm font-semibold text-slate-800 leading-snug">
              {goal}
            </p>
          )}

          {clarifyFeedback && (
            <div className="mt-2 p-2 bg-amber-50 rounded-lg border border-amber-200 flex items-start gap-1.5 text-[11px] text-amber-800">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
              <span><strong>UDL Alignment:</strong> {clarifyFeedback}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
