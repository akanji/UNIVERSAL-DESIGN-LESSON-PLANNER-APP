import React from 'react';
import { ChevronRight } from 'lucide-react';

interface StepperProps {
  currentStep: number;
  onSelectStep: (step: number) => void;
}

export const Stepper: React.FC<StepperProps> = ({ currentStep, onSelectStep }) => {
  const steps = [
    {
      num: 1,
      title: 'Context',
      subtitle: 'Lesson Information',
      color: 'bg-blue-600 text-white',
      border: 'border-blue-300',
      activeText: 'text-blue-900',
    },
    {
      num: 2,
      title: 'Learning Goal',
      subtitle: 'Define & Clarify',
      color: 'bg-orange-500 text-white',
      border: 'border-orange-300',
      activeText: 'text-orange-900',
    },
    {
      num: 3,
      title: 'Barriers',
      subtitle: 'Anticipate',
      color: 'bg-purple-600 text-white',
      border: 'border-purple-300',
      activeText: 'text-purple-900',
    },
    {
      num: 4,
      title: 'UDL Options',
      subtitle: 'Generate with AI',
      color: 'bg-sky-600 text-white',
      border: 'border-sky-300',
      activeText: 'text-sky-900',
    },
    {
      num: 5,
      title: 'CLEAR Check',
      subtitle: 'Quality Review',
      color: 'bg-indigo-600 text-white',
      border: 'border-indigo-300',
      activeText: 'text-indigo-900',
    },
    {
      num: 6,
      title: 'Build Lesson',
      subtitle: 'Finalize & Export',
      color: 'bg-amber-600 text-white',
      border: 'border-amber-300',
      activeText: 'text-amber-900',
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-3 mb-6 overflow-x-auto">
      <div className="flex items-center justify-between min-w-[780px] gap-2">
        {steps.map((st, idx) => {
          const isSelected = currentStep === st.num;
          return (
            <React.Fragment key={st.num}>
              <button
                onClick={() => onSelectStep(st.num)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all text-left cursor-pointer ${
                  isSelected ? 'bg-slate-100 ring-1 ring-slate-300' : 'hover:bg-slate-50'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shadow-2xs ${
                    st.color
                  }`}
                >
                  {st.num}
                </div>
                <div>
                  <div className={`text-xs font-bold leading-tight ${st.activeText}`}>
                    {st.title}
                  </div>
                  <div className="text-[10.5px] text-slate-500 font-medium leading-tight">
                    {st.subtitle}
                  </div>
                </div>
              </button>

              {idx < steps.length - 1 && (
                <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
