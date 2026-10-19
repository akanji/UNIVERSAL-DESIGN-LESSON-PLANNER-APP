import React, { useState } from 'react';
import { Edit3, Check, Sparkles, Plus, X } from 'lucide-react';
import { Barrier } from '../types/lesson';
import { scanBarriersWithAi } from '../services/geminiService';

interface BarriersCardProps {
  barriers: Barrier[];
  onToggleBarrier: (id: string) => void;
  onAddBarrier: (label: string) => void;
  onRemoveBarrier: (id: string) => void;
  subject: string;
  gradeLevel: string;
  learningGoal: string;
}

export const BarriersCard: React.FC<BarriersCardProps> = ({
  barriers,
  onToggleBarrier,
  onAddBarrier,
  onRemoveBarrier,
  subject,
  gradeLevel,
  learningGoal,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newBarrierInput, setNewBarrierInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = async () => {
    setIsScanning(true);
    try {
      const scanned = await scanBarriersWithAi(subject, gradeLevel, learningGoal);
      scanned.forEach((bLabel) => {
        if (!barriers.some(b => b.label.toLowerCase() === bLabel.toLowerCase())) {
          onAddBarrier(bLabel);
        }
      });
    } finally {
      setIsScanning(false);
    }
  };

  const handleAddNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (newBarrierInput.trim()) {
      onAddBarrier(newBarrierInput.trim());
      setNewBarrierInput('');
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 transition-all">
      <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
            3
          </div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">
            Anticipated Barriers
          </h3>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-semibold transition-colors cursor-pointer"
            title="Add or remove barriers"
          >
            {isEditing ? <Check className="w-3 h-3 text-emerald-600" /> : <Plus className="w-3 h-3 text-purple-600" />}
            <span>{isEditing ? 'Done' : 'Add Barrier'}</span>
          </button>

          <button
            onClick={handleScan}
            disabled={isScanning}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
            title="Scan potential barriers without diagnosing students"
          >
            <Sparkles className="w-3 h-3 text-purple-600" />
            <span>{isScanning ? 'Scanning...' : 'AI Scan'}</span>
          </button>
        </div>
      </div>

      {/* Barrier Chips */}
      <div className="flex flex-wrap gap-1.5">
        {barriers.map((barrier) => {
          return (
            <span
              key={barrier.id}
              onClick={() => onToggleBarrier(barrier.id)}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer select-none group ${
                barrier.active
                  ? 'bg-purple-50 text-purple-800 border border-purple-200/80 shadow-2xs'
                  : 'bg-slate-100 text-slate-400 border border-transparent line-through'
              }`}
            >
              <span>{barrier.label}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveBarrier(barrier.id);
                }}
                className="w-3.5 h-3.5 rounded-full hover:bg-rose-200 text-purple-600 hover:text-rose-700 flex items-center justify-center ml-0.5 opacity-60 group-hover:opacity-100 transition-opacity"
                title="Delete this barrier"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </span>
          );
        })}
      </div>

      {isEditing && (
        <form onSubmit={handleAddNew} className="mt-2.5 flex items-center gap-1.5">
          <input
            type="text"
            placeholder="Add anticipated barrier..."
            value={newBarrierInput}
            onChange={(e) => setNewBarrierInput(e.target.value)}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
          <button
            type="submit"
            className="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1"
          >
            <Plus className="w-3 h-3" />
            <span>Add</span>
          </button>
        </form>
      )}
    </div>
  );
};
