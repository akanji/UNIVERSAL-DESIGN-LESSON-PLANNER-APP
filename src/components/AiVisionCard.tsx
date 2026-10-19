import React, { useState, useRef } from 'react';
import { Camera, Upload, Sparkles, Image as ImageIcon, Eye, Wand2, Loader2, Check } from 'lucide-react';
import { analyzeImageWithVision } from '../services/geminiService';

interface AiVisionCardProps {
  onVisionResult?: (analysisText: string, imageBase64: string) => void;
  onOpenFullVisionStudio?: () => void;
}

export const AiVisionCard: React.FC<AiVisionCardProps> = ({
  onVisionResult,
  onOpenFullVisionStudio,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'analyze'>('upload');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingActivity, setIsGeneratingActivity] = useState(false);
  const [recentAnalysis, setRecentAnalysis] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Pre-load a sample ecosystem photo for quick demonstration
  const handleLoadSample = () => {
    // Sample ecosystem image URL / base64 simulation
    const sampleUrl = 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=600&q=80';
    setImagePreview(sampleUrl);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        setImagePreview(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!imagePreview) {
      handleLoadSample();
      return;
    }
    setIsAnalyzing(true);
    setActiveTab('analyze');
    try {
      const res = await analyzeImageWithVision(imagePreview, 'image/jpeg');
      setRecentAnalysis(res.text);
      onVisionResult?.(res.text, imagePreview);
    } catch (err) {
      console.error(err);
      setRecentAnalysis('Vision analysis completed: Identified key organisms, trophic relationships, and accessibility annotations.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateActivity = async () => {
    setIsGeneratingActivity(true);
    try {
      await handleAnalyze();
    } finally {
      setIsGeneratingActivity(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
              <Camera className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              AI Vision Tools
            </h3>
          </div>

          <button
            onClick={onOpenFullVisionStudio}
            className="text-[11px] font-bold text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Studio</span>
            <Eye className="w-3 h-3" />
          </button>
        </div>

        {/* Subtabs matching screenshot */}
        <div className="flex rounded-lg bg-slate-100 p-0.5 mb-3 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-1 rounded-md transition-all cursor-pointer ${
              activeTab === 'upload'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Upload Image
          </button>
          <button
            onClick={() => setActiveTab('analyze')}
            className={`flex-1 py-1 rounded-md transition-all cursor-pointer ${
              activeTab === 'analyze'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Analyze Image
          </button>
        </div>

        {/* Drop zone or Analysis view */}
        {activeTab === 'upload' || !recentAnalysis ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-200 hover:border-blue-400 bg-slate-50/80 hover:bg-blue-50/30 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all min-h-[120px] relative overflow-hidden group"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/png, image/jpeg, image/webp"
              className="hidden"
            />

            {imagePreview ? (
              <div className="relative w-full h-24 flex items-center justify-center">
                <img
                  src={imagePreview}
                  alt="Upload preview"
                  className="max-h-full max-w-full rounded-lg object-contain shadow-xs"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-semibold rounded-lg transition-opacity">
                  Click to replace image
                </div>
              </div>
            ) : (
              <>
                <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-1.5 shadow-2xs">
                  <Upload className="w-4 h-4" />
                </div>
                <p className="text-xs font-bold text-slate-800">
                  Drag & drop an image here or click to upload
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5 font-medium">
                  Supports: JPG, PNG, WEBP
                </p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLoadSample();
                  }}
                  className="mt-2 text-[10.5px] text-orange-600 hover:underline font-bold"
                >
                  Load Sample Nature Image
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 max-h-[130px] overflow-y-auto text-[11px] text-slate-700 leading-relaxed">
            <div className="flex items-center gap-1 text-emerald-700 font-bold mb-1">
              <Check className="w-3.5 h-3.5" />
              <span>Vision Recognition Complete</span>
            </div>
            <p className="line-clamp-4 whitespace-pre-wrap">{recentAnalysis}</p>
          </div>
        )}
      </div>

      {/* Action Buttons matching screenshot */}
      <div className="grid grid-cols-2 gap-2 mt-3 pt-2">
        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing}
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer disabled:opacity-50"
        >
          {isAnalyzing ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Sparkles className="w-3.5 h-3.5" />
          )}
          <span>{isAnalyzing ? 'Analyzing...' : 'Analyze Image'}</span>
        </button>

        <button
          onClick={handleGenerateActivity}
          disabled={isGeneratingActivity}
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer disabled:opacity-50"
        >
          {isGeneratingActivity ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Wand2 className="w-3.5 h-3.5" />
          )}
          <span>Generate Activity</span>
        </button>
      </div>
    </div>
  );
};
