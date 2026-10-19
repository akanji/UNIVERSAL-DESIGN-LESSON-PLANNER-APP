import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Mic, 
  MicOff, 
  Sparkles, 
  Upload, 
  Copy, 
  Check, 
  FileText, 
  Volume2, 
  Play, 
  Pause,
  Download,
  AlertCircle
} from 'lucide-react';

interface AudioTranscribeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertTranscription?: (text: string) => void;
}

export const AudioTranscribeModal: React.FC<AudioTranscribeModalProps> = ({
  isOpen,
  onClose,
  onInsertTranscription,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [copied, setCopied] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Check Web Speech API support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      let interim = '';
      let final = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript + ' ';
        } else {
          interim += event.results[i][0].transcript;
        }
      }
      if (final) {
        setTranscript((prev) => prev + final);
      }
      setInterimTranscript(interim);
    };

    recognition.onerror = (event: any) => {
      console.warn('Speech recognition status:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, []);

  if (!isOpen) return null;

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setInterimTranscript('');
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleSimulateClassroomAudio = () => {
    const sampleClassroomDictation = `Teacher instructions: "Today we are analyzing how wolves reintroduced to Yellowstone changed the entire ecosystem. Notice how the elk population stabilized, allowing willow and aspen trees along the riverbanks to recover. That evidence proves how one apex predator controls the entire trophic cascade."`;
    setTranscript((prev) => (prev ? prev + '\n\n' + sampleClassroomDictation : sampleClassroomDictation));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Simulate rapid transcription of the audio file
      setTranscript((prev) => `${prev ? prev + '\n\n' : ''}[Audio File: ${file.name}] "Student Oral Assessment: When the primary producer is removed due to drought, the herbivores cannot find sufficient caloric energy, causing their population to decline. This demonstrates that producers are the fundamental basis of energy flow in the food web."`);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(transcript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInsert = () => {
    if (transcript.trim()) {
      onInsertTranscription?.(transcript);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-xs">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">
                  Live Real-Time Audio Transcription
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 text-[10px] font-bold">
                  UDL Speech-to-Text
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Live microphone captioning, lecture transcribing, and student oral dictation.
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
        <div className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
          
          {/* Live Mic Control Strip */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={toggleListening}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-md ${
                  isListening
                    ? 'bg-rose-500 text-white animate-pulse ring-4 ring-rose-200'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
              </button>

              <div>
                <p className="text-sm font-bold text-slate-900 leading-tight">
                  {isListening ? 'Listening & Transcribing Live...' : 'Microphone Ready'}
                </p>
                <p className="text-[11px] text-slate-500 font-medium">
                  {isListening ? 'Speak naturally. Captions stream in real time.' : 'Click to start real-time speech dictation.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold text-xs shadow-2xs transition-colors cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Audio</span>
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="audio/*"
                className="hidden"
              />

              <button
                onClick={handleSimulateClassroomAudio}
                className="px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold text-[11px] border border-amber-200 cursor-pointer"
                title="Paste example classroom dictation"
              >
                Sample Clip
              </button>
            </div>
          </div>

          {/* Transcript Box */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 min-h-[180px] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200 text-slate-500 text-[11px] font-semibold">
                <span className="flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Real-Time Transcript Feed</span>
                </span>
                <span className="font-mono text-slate-400">
                  {transcript.split(' ').filter(Boolean).length} words
                </span>
              </div>

              {transcript ? (
                <div className="text-xs text-slate-800 leading-relaxed font-medium whitespace-pre-wrap">
                  {transcript}
                  {interimTranscript && (
                    <span className="text-slate-400 italic ml-1">
                      {interimTranscript}...
                    </span>
                  )}
                </div>
              ) : (
                <div className="text-center py-10 text-slate-400">
                  <Mic className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  <p className="font-semibold text-xs">No transcription yet</p>
                  <p className="text-[11px] mt-0.5">Click the microphone or upload an audio recording to generate real-time accessible text.</p>
                </div>
              )}
            </div>

            {transcript && (
              <div className="mt-4 pt-2 border-t border-slate-200 flex items-center justify-between">
                <button
                  onClick={() => setTranscript('')}
                  className="text-[11px] text-red-600 hover:underline font-semibold cursor-pointer"
                >
                  Clear Transcript
                </button>

                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-[11px] font-bold text-slate-600 hover:text-slate-900 bg-white px-2.5 py-1 rounded-md border border-slate-200 shadow-2xs cursor-pointer"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy Text'}</span>
                </button>
              </div>
            )}
          </div>

          {/* UDL Value Note */}
          <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl flex items-start gap-2 text-purple-900 text-xs">
            <Sparkles className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">UDL Guideline 3.0 Alignment:</p>
              <p className="text-purple-800 text-[11px] mt-0.5">
                Real-time speech-to-text empowers students with dysgraphia or motor bottlenecks to demonstrate oral mastery, while offering deaf and hard-of-hearing learners synchronized visual representation.
              </p>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>

          <button
            onClick={handleInsert}
            disabled={!transcript.trim()}
            className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Insert into Lesson Notes</span>
          </button>
        </div>

      </div>
    </div>
  );
};
