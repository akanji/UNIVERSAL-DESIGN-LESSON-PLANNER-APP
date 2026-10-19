import React from 'react';
import { Sparkles, Camera, Lightbulb, CheckCircle2, Share2 } from 'lucide-react';

interface HeroBannerProps {
  onQuickAction: (action: 'ideas' | 'images' | 'options' | 'clear' | 'export') => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onQuickAction }) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-sky-400 via-sky-300 to-orange-400 p-6 md:p-8 text-slate-900 shadow-md mb-6 border border-sky-200">
      
      {/* Decorative gradient wave overlays and image preview */}
      <div className="absolute right-0 top-0 bottom-0 w-2/5 md:w-1/3 bg-cover bg-center opacity-85 hidden sm:block pointer-events-none rounded-r-2xl" 
           style={{ 
             backgroundImage: `url('https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80')`,
             maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)',
             WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)'
           }} 
      />

      <div className="relative z-10 max-w-2xl">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-blue-950 tracking-tight leading-tight mb-2">
          Plan Inclusive Lessons with the Power of AI
        </h1>
        <p className="text-sm md:text-base font-medium text-blue-900/90 mb-5">
          Design engaging, accessible, and purposeful learning experiences using the UDL framework.
        </p>

        {/* Action pills matching screenshot */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onQuickAction('ideas')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/95 hover:bg-white text-orange-600 font-bold text-xs shadow-sm hover:shadow-md transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-orange-500 fill-orange-500/20" />
            <span>AI Lesson Ideas</span>
          </button>

          <button
            onClick={() => onQuickAction('images')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/95 hover:bg-white text-purple-700 font-bold text-xs shadow-sm hover:shadow-md transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Camera className="w-3.5 h-3.5 text-purple-600" />
            <span>Analyze Images</span>
          </button>

          <button
            onClick={() => onQuickAction('options')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/95 hover:bg-white text-amber-700 font-bold text-xs shadow-sm hover:shadow-md transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
            <span>Generate Options</span>
          </button>

          <button
            onClick={() => onQuickAction('clear')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/95 hover:bg-white text-emerald-700 font-bold text-xs shadow-sm hover:shadow-md transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Check with CLEAR</span>
          </button>

          <button
            onClick={() => onQuickAction('export')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/95 hover:bg-white text-blue-700 font-bold text-xs shadow-sm hover:shadow-md transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Share2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Export & Share</span>
          </button>
        </div>
      </div>
    </div>
  );
};
