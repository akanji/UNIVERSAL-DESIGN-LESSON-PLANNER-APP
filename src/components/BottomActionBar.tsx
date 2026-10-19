import React from 'react';
import { FileText, Eye, Download, Bookmark, Share2, Calendar, Sparkles, Printer } from 'lucide-react';

interface BottomActionBarProps {
  onPreview: () => void;
  onDownloadPdf: () => void;
  onPrint?: () => void;
  onSaveToLibrary: () => void;
  onShare: () => void;
  onScheduleCalendar?: () => void;
  onOpenWorkspace?: (tab?: 'meet' | 'slides' | 'classroom' | 'docs' | 'keep' | 'chat') => void;
}

export const BottomActionBar: React.FC<BottomActionBarProps> = ({
  onPreview,
  onDownloadPdf,
  onPrint,
  onSaveToLibrary,
  onShare,
  onScheduleCalendar,
  onOpenWorkspace,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 mt-6 flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Left text */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-xs">
          <FileText className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm md:text-base font-bold text-slate-900 leading-tight">
            Build Your Lesson
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Combine your selected options into a complete, polished lesson plan.
          </p>
        </div>
      </div>

      {/* Action Buttons matching screenshot */}
      <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
        <button
          onClick={onPreview}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-2xs transition-colors cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Preview Lesson</span>
        </button>

        <button
          onClick={onDownloadPdf}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-2xs transition-colors cursor-pointer"
          title="Download printable PDF / Markdown lesson file"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download PDF</span>
        </button>

        <button
          onClick={onPrint || onPreview}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-2xs transition-colors cursor-pointer"
          title="Print lesson plan or Save as PDF via browser print dialogue"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print / PDF</span>
        </button>

        <button
          onClick={onSaveToLibrary}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-2xs transition-colors cursor-pointer"
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>Save to Library</span>
        </button>

        <button
          onClick={() => onOpenWorkspace?.()}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-2xs transition-colors cursor-pointer"
          title="Google Workspace Suite: Meet, Slides, Classroom, Docs, Keep, Chat"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Google Workspace Hub</span>
        </button>

        <button
          onClick={onScheduleCalendar}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-2xs transition-colors cursor-pointer"
          title="Schedule lesson into Google Calendar"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Schedule (Google Calendar)</span>
        </button>

        <button
          onClick={onShare}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-2xs transition-colors cursor-pointer"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Share</span>
        </button>
      </div>
    </div>
  );
};
