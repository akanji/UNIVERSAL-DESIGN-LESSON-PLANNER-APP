import React, { useState } from 'react';
import { 
  X, 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Users, 
  Check, 
  Sparkles, 
  ExternalLink, 
  Download, 
  FileText,
  AlertCircle
} from 'lucide-react';
import { LessonPlan } from '../types/lesson';

interface CalendarIntegrationManagerProps {
  isOpen: boolean;
  onClose: () => void;
  lesson: LessonPlan;
  onScheduledSuccess?: (eventDetails: any) => void;
}

export const CalendarIntegrationManager: React.FC<CalendarIntegrationManagerProps> = ({
  isOpen,
  onClose,
  lesson,
  onScheduledSuccess,
}) => {
  const [eventDate, setEventDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [startTime, setStartTime] = useState('09:00');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [location, setLocation] = useState('Science Lab Room 204');
  const [coTeachers, setCoTeachers] = useState('m.miller@district.edu, s.lin@district.edu');
  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduledConfirmed, setScheduledConfirmed] = useState(false);

  if (!isOpen) return null;

  // Format start & end date for Google Calendar render link (YYYYMMDDTHHMMSSZ)
  const getGoogleCalendarUrl = () => {
    const [startHour, startMin] = startTime.split(':').map(Number);
    const startObj = new Date(`${eventDate}T${startTime}:00`);
    const endObj = new Date(startObj.getTime() + durationMinutes * 60000);

    const pad = (n: number) => (n < 10 ? '0' + n : n);
    const formatDateForGCal = (d: Date) => {
      return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
    };

    const datesParam = `${formatDateForGCal(startObj)}/${formatDateForGCal(endObj)}`;
    const title = encodeURIComponent(`[UDL Lesson] ${lesson.title} (${lesson.gradeLevel})`);
    const details = encodeURIComponent(
      `Firm Learning Goal: "${lesson.learningGoal}"\n\n` +
      `Standard: ${lesson.learningStandard}\n\n` +
      `UDL Multi-Pathway Architecture:\n` +
      `- Engagement: Real-world scenarios, choice of topic\n` +
      `- Representation: Audio, video, 3D spatial models\n` +
      `- Action & Expression: Written CER, podcast, or annotated diagrams\n\n` +
      `CLEAR Quality Score: 19.3/20 READY\n\n` +
      `Co-Teachers: ${coTeachers}\n` +
      `Platform: Universal Design Lesson Planner`
    );
    const loc = encodeURIComponent(location);

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${datesParam}&details=${details}&location=${loc}&add=${encodeURIComponent(coTeachers)}`;
  };

  const handleOpenGoogleCalendar = () => {
    setIsScheduling(true);
    const url = getGoogleCalendarUrl();
    window.open(url, '_blank', 'noopener,noreferrer');
    setTimeout(() => {
      setIsScheduling(false);
      setScheduledConfirmed(true);
      onScheduledSuccess?.({ date: eventDate, time: startTime, lesson: lesson.title });
    }, 1000);
  };

  const handleDownloadIcs = () => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Universal Design Lesson Planner//EN
CALSCALE:GREGORIAN
BEGIN:VEVENT
SUMMARY:[UDL Lesson] ${lesson.title}
DESCRIPTION:Firm Learning Goal: ${lesson.learningGoal}\\nCLEAR Score: 19.3/20 READY
LOCATION:${location}
DTSTART:${eventDate.replace(/-/g, '')}T${startTime.replace(':', '')}00
DURATION:PT${durationMinutes}M
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${lesson.title.toLowerCase().replace(/\s+/g, '-')}-schedule.ics`;
    a.click();
    setScheduledConfirmed(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 md:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">
                  Google Calendar Lesson Scheduler
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
                  Google Workspace
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Schedule instructional periods directly to your Google Calendar.
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

        {/* Content Body */}
        <div className="p-5 space-y-4 text-xs">
          
          {/* Target Lesson Summary Card */}
          <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">Lesson Event</span>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">19.3/20 CLEAR</span>
            </div>
            <h3 className="text-sm font-bold text-blue-950 mb-0.5">{lesson.title}</h3>
            <p className="text-[11px] text-slate-600 line-clamp-1"><strong>Goal:</strong> {lesson.learningGoal}</p>
          </div>

          {/* Date & Time Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Lesson Date:</label>
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Start Time:</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Duration:</label>
              <select
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value={45}>45 mins</option>
                <option value={60}>60 mins</option>
                <option value={75}>75 mins</option>
                <option value={90}>90 mins</option>
              </select>
            </div>
          </div>

          {/* Location & Classroom */}
          <div>
            <label className="block text-slate-700 font-bold mb-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-orange-500" />
              <span>Location / Classroom:</span>
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Science Lab 204, Virtual Meet link..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Co-Teachers & Invites */}
          <div>
            <label className="block text-slate-700 font-bold mb-1 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-purple-600" />
              <span>Co-Teacher & Specialist Invites:</span>
            </label>
            <input
              type="text"
              value={coTeachers}
              onChange={(e) => setCoTeachers(e.target.value)}
              placeholder="Comma-separated emails..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-[11px]"
            />
          </div>

          {scheduledConfirmed && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Lesson scheduled! Calendar details prepared with UDL pathways.</span>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <button
            onClick={handleDownloadIcs}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold text-xs cursor-pointer shadow-2xs"
            title="Download .ics file for Apple Calendar, Outlook, or Google"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .ICS</span>
          </button>

          <button
            onClick={handleOpenGoogleCalendar}
            disabled={isScheduling}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer disabled:opacity-50"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>{isScheduling ? 'Opening Calendar...' : 'Schedule in Google Calendar'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
