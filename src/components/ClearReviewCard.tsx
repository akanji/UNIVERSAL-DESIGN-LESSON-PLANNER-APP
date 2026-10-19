import React from 'react';
import { CheckCircle2, ShieldCheck, ChevronRight } from 'lucide-react';

interface ClearReviewCardProps {
  onOpenClearDetails?: () => void;
}

export const ClearReviewCard: React.FC<ClearReviewCardProps> = ({ onOpenClearDetails }) => {
  const criteria = [
    { letter: 'C', label: 'Connection to Goal', score: '18/20', color: 'bg-amber-500' },
    { letter: 'L', label: 'Learner Variability', score: '17/20', color: 'bg-amber-600' },
    { letter: 'E', label: 'Engagement & Access', score: '18/20', color: 'bg-orange-500' },
    { letter: 'A', label: 'Appropriate Challenge', score: '17/20', color: 'bg-rose-500' },
    { letter: 'R', label: 'Reduces Barriers', score: '19/20', color: 'bg-emerald-600' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 flex flex-col justify-between">
      <div>
        {/* Header matching screenshot */}
        <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              CLEAR Review
            </h3>
          </div>

          <button
            onClick={onOpenClearDetails}
            className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-0.5 cursor-pointer"
          >
            <span>Rubric</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* Breakdown rows */}
        <div className="space-y-1.5 text-xs">
          {criteria.map((item) => (
            <div
              key={item.letter}
              className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className={`w-5 h-5 rounded-md ${item.color} text-white font-black text-[11px] flex items-center justify-center shadow-2xs`}>
                  {item.letter}
                </span>
                <span className="font-semibold text-slate-700 text-[11px]">
                  {item.label}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-slate-600 text-[11px] font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 fill-emerald-100" />
                <span>{item.score}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Overall Score Badge matching screenshot */}
      <div 
        onClick={onOpenClearDetails}
        className="mt-3 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 rounded-xl p-2.5 flex items-center justify-between cursor-pointer transition-colors"
      >
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">
              Overall CLEAR Score
            </p>
            <p className="text-base font-black text-emerald-950 leading-none">
              18/20 <span className="text-[11px] font-bold text-emerald-700 ml-1">READY</span>
            </p>
          </div>
        </div>

        <span className="text-[10px] font-bold text-emerald-700 bg-white/80 px-2 py-0.5 rounded-full border border-emerald-200">
          90% UDL Fit
        </span>
      </div>
    </div>
  );
};
