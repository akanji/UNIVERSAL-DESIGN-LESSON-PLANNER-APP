import React, { useRef, useState, useEffect } from 'react';
import { 
  X, 
  PenTool, 
  Square, 
  ArrowRight, 
  StickyNote, 
  Eraser, 
  RotateCcw, 
  Download, 
  Sparkles, 
  Check, 
  Plus, 
  Palette,
  Maximize2
} from 'lucide-react';
import { UdlOption } from '../types/lesson';

interface CollaborativeWhiteboardProps {
  isOpen: boolean;
  onClose: () => void;
  onAttachDiagramAsOption?: (option: UdlOption, imageDataUrl: string) => void;
}

const PALETTE = [
  { name: 'Sky Blue', color: '#0284c7' },
  { name: 'Warm Orange', color: '#f97316' },
  { name: 'Royal Purple', color: '#9333ea' },
  { name: 'Emerald', color: '#10b981' },
  { name: 'Slate Dark', color: '#1e293b' },
];

export const CollaborativeWhiteboard: React.FC<CollaborativeWhiteboardProps> = ({
  isOpen,
  onClose,
  onAttachDiagramAsOption,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tool, setTool] = useState<'pen' | 'rect' | 'arrow' | 'note' | 'eraser'>('pen');
  const [color, setColor] = useState('#0284c7');
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);
  const [snapshot, setSnapshot] = useState<ImageData | null>(null);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [attachedSuccess, setAttachedSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // High DPI setup
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);

    // Initial canvas background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Draw subtle grid dots
    drawGrid(ctx, rect.width, rect.height);

    // Load initial UDL pathway diagram template
    drawUdlPathwayTemplate(ctx);

    // Save initial state to history
    saveHistoryState(ctx, rect.width, rect.height);
  }, [isOpen]);

  const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.fillStyle = '#f1f5f9';
    for (let x = 20; x < width; x += 25) {
      for (let y = 20; y < height; y += 25) {
        ctx.fillRect(x, y, 1.5, 1.5);
      }
    }
  };

  const drawUdlPathwayTemplate = (ctx: CanvasRenderingContext2D) => {
    // Goal Hub (Center Top)
    ctx.fillStyle = '#f8fafc';
    ctx.strokeStyle = '#f97316';
    ctx.lineWidth = 2.5;
    roundRect(ctx, 240, 25, 280, 50, 10);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('FIRM LEARNING GOAL: Ecosystem Interdependence', 380, 54);

    // Pathway Branches
    const branches = [
      { title: 'Pathway A: Visual / Tactile 3D', col: '#0284c7', x: 70, y: 140 },
      { title: 'Pathway B: Audio / Oral Podcast', col: '#9333ea', x: 280, y: 140 },
      { title: 'Pathway C: Simulation Inquiry', col: '#10b981', x: 490, y: 140 },
    ];

    branches.forEach((b) => {
      // Connecting arrow from Goal to branch
      ctx.beginPath();
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2;
      ctx.moveTo(380, 75);
      ctx.lineTo(b.x + 90, b.y);
      ctx.stroke();

      // Branch Box
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = b.col;
      ctx.lineWidth = 2;
      roundRect(ctx, b.x, b.y, 180, 65, 8);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = b.col;
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(b.title, b.x + 90, b.y + 28);

      ctx.fillStyle = '#64748b';
      ctx.font = '10px sans-serif';
      ctx.fillText('✓ Same cognitive standard', b.x + 90, b.y + 48);
    });
  };

  const roundRect = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  };

  const saveHistoryState = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    const data = ctx.getImageData(0, 0, w * 2, h * 2);
    setHistory((prev) => [...prev.slice(-10), data]);
  };

  const getCanvasPos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const pos = getCanvasPos(e);
    setIsDrawing(true);
    setStartPos(pos);

    // Save snapshot for shape previews
    const rect = canvas.getBoundingClientRect();
    setSnapshot(ctx.getImageData(0, 0, rect.width * 2, rect.height * 2));

    if (tool === 'pen' || tool === 'eraser') {
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
      ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
      ctx.lineWidth = tool === 'eraser' ? 20 : strokeWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !startPos) return;

    const pos = getCanvasPos(e);

    if (tool === 'pen' || tool === 'eraser') {
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    } else if (snapshot) {
      // Restore snapshot to redraw preview
      ctx.putImageData(snapshot, 0, 0);

      ctx.strokeStyle = color;
      ctx.lineWidth = strokeWidth;

      if (tool === 'rect') {
        const w = pos.x - startPos.x;
        const h = pos.y - startPos.y;
        ctx.strokeRect(startPos.x, startPos.y, w, h);
      } else if (tool === 'arrow') {
        // Draw directional line with arrowhead
        ctx.beginPath();
        ctx.moveTo(startPos.x, startPos.y);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();

        const angle = Math.atan2(pos.y - startPos.y, pos.x - startPos.x);
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        ctx.lineTo(pos.x - 12 * Math.cos(angle - Math.PI / 6), pos.y - 12 * Math.sin(angle - Math.PI / 6));
        ctx.moveTo(pos.x, pos.y);
        ctx.lineTo(pos.x - 12 * Math.cos(angle + Math.PI / 6), pos.y - 12 * Math.sin(angle + Math.PI / 6));
        ctx.stroke();
      } else if (tool === 'note') {
        ctx.fillStyle = '#fef08a'; // Yellow sticky note
        ctx.fillRect(startPos.x, startPos.y, 110, 65);
        ctx.strokeStyle = '#ca8a04';
        ctx.strokeRect(startPos.x, startPos.y, 110, 65);
        ctx.fillStyle = '#854d0e';
        ctx.font = 'bold 10px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('Pathway Note:', startPos.x + 8, startPos.y + 18);
      }
    }
  };

  const handleMouseUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      const rect = canvas.getBoundingClientRect();
      saveHistoryState(ctx, rect.width, rect.height);
    }
  };

  const handleUndo = () => {
    if (history.length <= 1) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const newHistory = history.slice(0, -1);
    const last = newHistory[newHistory.length - 1];
    ctx.putImageData(last, 0, 0);
    setHistory(newHistory);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = `udl-pathway-diagram-${Date.now()}.png`;
    a.click();
  };

  const handleAttachOption = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');

    const newOption: UdlOption = {
      id: `whiteboard-opt-${Date.now()}`,
      title: 'Teacher-Curated Visual Pathway Flowchart',
      principle: 'representation',
      purpose: 'Provides a graphic organizational map depicting multiple equivalent routes to the core learning goal.',
      barrierAddressed: 'Linear text confusion and abstract procedural navigation barriers.',
      learnerPathway: 'Students consult the visual pathway map to navigate their preferred learning sequence.',
      teacherImplementation: 'Display visual pathway diagram on classroom board or distribute as visual guide.',
      materials: ['Universal Design Lesson Planner Whiteboard Diagram'],
      goalPreserved: true,
      goalDriftRisk: 'low',
      selected: true,
      clear: {
        connectedToGoal: 4,
        learningPreserving: 4,
        equitableAccess: 4,
        authenticEvidence: 4,
        realisticReady: 4,
        total: 20,
        status: 'READY',
        feedback: 'Directly supports executive function and spatial representation of choice pathways.'
      }
    };

    onAttachDiagramAsOption?.(newOption, dataUrl);
    setAttachedSuccess(true);
    setTimeout(() => {
      setAttachedSuccess(false);
      onClose();
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 md:p-6 overflow-hidden">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-5xl w-full h-[88vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center shadow-xs">
              <PenTool className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-900">
                  Collaborative Visual Pathway Whiteboard
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 text-[10px] font-bold">
                  UDL Representation Studio
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Sketch, flowchart, and annotate multi-modal pathway options for your learners.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleUndo}
              disabled={history.length <= 1}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold disabled:opacity-40 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Undo</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export PNG</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="px-4 py-2 border-b border-slate-200 bg-white flex flex-wrap items-center justify-between gap-3 text-xs">
          
          {/* Drawing Tools */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setTool('pen')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                tool === 'pen' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <PenTool className="w-3.5 h-3.5" />
              <span>Pen</span>
            </button>

            <button
              onClick={() => setTool('rect')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                tool === 'rect' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Square className="w-3.5 h-3.5" />
              <span>Pathway Box</span>
            </button>

            <button
              onClick={() => setTool('arrow')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                tool === 'arrow' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>Branch Arrow</span>
            </button>

            <button
              onClick={() => setTool('note')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                tool === 'note' ? 'bg-white text-amber-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <StickyNote className="w-3.5 h-3.5 text-amber-500" />
              <span>Sticky Note</span>
            </button>

            <button
              onClick={() => setTool('eraser')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                tool === 'eraser' ? 'bg-white text-rose-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Eraser className="w-3.5 h-3.5" />
              <span>Eraser</span>
            </button>
          </div>

          {/* Color Palette */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-500">Color:</span>
            <div className="flex items-center gap-1.5">
              {PALETTE.map((p) => (
                <button
                  key={p.name}
                  onClick={() => setColor(p.color)}
                  style={{ backgroundColor: p.color }}
                  className={`w-5 h-5 rounded-full transition-transform cursor-pointer ${
                    color === p.color ? 'ring-2 ring-offset-1 ring-slate-800 scale-110' : 'hover:scale-105'
                  }`}
                  title={p.name}
                />
              ))}
            </div>
          </div>

          {/* Stroke Width */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-500">Weight:</span>
            <div className="flex items-center gap-1">
              {[2, 3, 5, 8].map((w) => (
                <button
                  key={w}
                  onClick={() => setStrokeWidth(w)}
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold cursor-pointer ${
                    strokeWidth === w ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {w}px
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Canvas Area */}
        <div className="flex-1 bg-slate-100 relative overflow-hidden">
          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="w-full h-full cursor-crosshair"
          />

          {attachedSuccess && (
            <div className="absolute top-4 right-4 bg-emerald-600 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-lg flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4 stroke-3" />
              <span>Visual diagram attached to UDL options!</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <p className="text-xs text-slate-500 font-medium">
            Diagram automatically converts into a high-resolution accessible visual representation asset.
          </p>

          <button
            onClick={handleAttachOption}
            className="flex items-center gap-1.5 px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Attach Diagram to UDL Representation</span>
          </button>
        </div>

      </div>
    </div>
  );
};
