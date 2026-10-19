import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  Brain, 
  Zap, 
  Globe, 
  Loader2, 
  Check, 
  AlertCircle 
} from 'lucide-react';
import { performThinkingReasoning } from '../services/geminiService';

interface UdlCoDesignerChatProps {
  isOpen: boolean;
  onClose: () => void;
  currentGoal: string;
}

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  modelUsed?: string;
  thinking?: boolean;
}

export const UdlCoDesignerChat: React.FC<UdlCoDesignerChatProps> = ({
  isOpen,
  onClose,
  currentGoal,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'ai',
      text: `Welcome to UDL Co-Designer!
Tell me what you want learners to learn or demonstrate. I'll help you clarify the goal, anticipate barriers, generate purposeful UDL options, and check each option against CLEAR.

I won't automatically lower expectations or create a separate lesson for every learner.
The goal is one strong learning target with multiple meaningful pathways.`,
      modelUsed: 'gemini-3.8-flash'
    }
  ]);

  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'standard' | 'fast' | 'think'>('think');
  const [useSearch, setUseSearch] = useState(false);
  const [isSending, setIsSending] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (customText?: string) => {
    const textToSend = customText || input;
    if (!textToSend.trim() || isSending) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: textToSend,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsSending(true);

    try {
      let aiResponseText = '';
      let modelLabel = 'gemini-3.8-flash';

      if (mode === 'think') {
        modelLabel = 'gemini-4-argon (Thinking Level: HIGH)';
        aiResponseText = await performThinkingReasoning(
          `User request: "${textToSend}". Current Lesson Target: "${currentGoal}". Ground your reasoning strictly in CAST UDL Guidelines 3.0 and the CLEAR rubric.`
        );
      } else if (mode === 'fast') {
        modelLabel = 'gemini-3.1-flash-lite';
        const res = await fetch('/api/gemini/fast', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: `UDL Coach quick response for: "${textToSend}". Goal: "${currentGoal}".`
          })
        });
        const d = await res.json();
        aiResponseText = d.text;
      } else {
        modelLabel = 'gemini-3.8-flash';
        const res = await fetch('/api/gemini/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: `UDL instructional coach advice: "${textToSend}". Current Goal: "${currentGoal}".`,
            useSearch: useSearch
          })
        });
        const d = await res.json();
        aiResponseText = d.text;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: aiResponseText || 'Here is your aligned UDL recommendation.',
          modelUsed: modelLabel,
          thinking: mode === 'think'
        }
      ]);
    } catch (e: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'ai',
          text: `[UDL Coach Advice]: When designing for "${textToSend}", ensure you decouple the method of demonstration from the construct being assessed. Offer a choice of visual modeling, audio narration, or structured writing while keeping the evidence requirement firm.`,
          modelUsed: 'Offline Fallback'
        }
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const promptChips = [
    'Clarify my goal',
    'Find potential barriers',
    'Check for goal drift',
    'Generate kinesthetic alternative',
    'Make these choices more equivalent',
    'Create an exit ticket'
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 md:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-3xl w-full h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">
                  UDL Co-Designer Assistant
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-[10px] font-bold">
                  Active Coach
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                CAST UDL 3.0 Alignment, CLEAR Quality Control, and Goal Drift Prevention.
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

        {/* Intelligence Mode Bar */}
        <div className="px-4 py-2 bg-slate-100/80 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-semibold">Engine:</span>
            <button
              onClick={() => setMode('think')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                mode === 'think' ? 'bg-purple-600 text-white shadow-2xs' : 'bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Brain className="w-3.5 h-3.5" />
              <span>High Thinking (Argon)</span>
            </button>

            <button
              onClick={() => setMode('fast')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                mode === 'fast' ? 'bg-amber-500 text-white shadow-2xs' : 'bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Fast (Flash-Lite)</span>
            </button>

            <button
              onClick={() => setMode('standard')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                mode === 'standard' ? 'bg-blue-600 text-white shadow-2xs' : 'bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>Standard (3.8 Flash)</span>
            </button>
          </div>

          <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-slate-600 font-semibold select-none">
            <input
              type="checkbox"
              checked={useSearch}
              onChange={(e) => setUseSearch(e.target.checked)}
              className="rounded text-blue-600 focus:ring-0"
            />
            <Globe className="w-3 h-3 text-blue-500" />
            <span>Search Grounding</span>
          </label>
        </div>

        {/* Chat History */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'ai' && (
                <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-br-xs'
                    : 'bg-slate-100 text-slate-800 rounded-bl-xs border border-slate-200/80 shadow-2xs'
                }`}
              >
                <div className="whitespace-pre-wrap font-medium">{m.text}</div>
                {m.modelUsed && (
                  <div className="mt-2 pt-1 border-t border-slate-200/60 text-[10px] text-slate-400 flex items-center justify-between">
                    <span>Engine: {m.modelUsed}</span>
                    {m.thinking && <span className="text-purple-600 font-bold">Deep Reasoning Enabled</span>}
                  </div>
                )}
              </div>

              {m.sender === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isSending && (
            <div className="flex gap-2.5 items-center text-xs text-purple-600 font-semibold p-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>UDL Co-Designer is formulating pedagogically sound advice...</span>
            </div>
          )}
        </div>

        {/* Prompt Chips */}
        <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/60 flex items-center gap-1.5 overflow-x-auto">
          {promptChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(chip)}
              className="px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-300 text-[11px] font-semibold transition-all shrink-0 cursor-pointer shadow-2xs"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask UDL Co-Designer to clarify goals, design scaffolds, or audit options..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
          />

          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isSending}
            className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
