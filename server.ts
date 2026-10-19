import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper for error responses
const handleError = (res: Response, error: unknown, fallbackMessage: string) => {
  console.error(fallbackMessage, error);
  const errMsg = error instanceof Error ? error.message : String(error);
  res.status(500).json({ error: errMsg || fallbackMessage });
};

// 1. General Gemini Generation (gemini-3.8-flash) with optional Google Search
app.post('/api/gemini/generate', async (req: Request, res: Response) => {
  try {
    const { prompt, systemInstruction, useSearch, temperature } = req.body;
    
    if (!apiKey) {
      return res.status(200).json({
        text: `[Offline Simulation] Analysis complete for: ${prompt.slice(0, 80)}...`,
        simulated: true
      });
    }

    const config: any = {
      temperature: temperature ?? 0.6,
    };

    if (systemInstruction) {
      config.systemInstruction = systemInstruction;
    }

    if (useSearch) {
      config.tools = [{ googleSearch: {} }];
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config,
    });

    const text = response.text || '';
    const searchGrounding = response.candidates?.[0]?.groundingMetadata;
    res.json({ text, searchGrounding });
  } catch (error) {
    handleError(res, error, 'Failed to generate content with gemini-3.8-flash');
  }
});

// 2. Fast Low-Latency Generation (gemini-3.1-flash-lite)
app.post('/api/gemini/fast', async (req: Request, res: Response) => {
  try {
    const { prompt, systemInstruction } = req.body;

    if (!apiKey) {
      return res.status(200).json({
        text: `[Fast Simulation]: Rapid response for: ${prompt.slice(0, 60)}...`,
        simulated: true
      });
    }

    const config: any = {
      temperature: 0.4,
    };
    if (systemInstruction) {
      config.systemInstruction = systemInstruction;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: prompt,
      config,
    });

    res.json({ text: response.text || '' });
  } catch (error) {
    handleError(res, error, 'Failed fast response with gemini-3.1-flash-lite');
  }
});

// 3. High Thinking Mode (gemini-4-argon with thinkingLevel: HIGH)
app.post('/api/gemini/think', async (req: Request, res: Response) => {
  try {
    const { prompt, systemInstruction } = req.body;

    if (!apiKey) {
      return res.status(200).json({
        text: `[High Thinking Simulation]: Rigorous pedagogical and goal-drift evaluation for: ${prompt.slice(0, 80)}...`,
        simulated: true
      });
    }

    const config: any = {
      thinkingConfig: {
        thinkingLevel: ThinkingLevel.HIGH,
      },
    };
    if (systemInstruction) {
      config.systemInstruction = systemInstruction;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-4-argon',
      contents: prompt,
      config,
    });

    res.json({ text: response.text || '' });
  } catch (error) {
    handleError(res, error, 'Failed high-thinking reasoning with gemini-4-argon');
  }
});

// 4. Computer Vision & Multimodal Analysis (gemini-3.8-flash)
app.post('/api/gemini/vision', async (req: Request, res: Response) => {
  try {
    const { prompt, imageBase64, mimeType = 'image/jpeg' } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'imageBase64 is required' });
    }

    if (!apiKey) {
      return res.status(200).json({
        text: `[Vision Simulation]: Detected ecological elements, biodiversity, and tactile educational connections.`,
        detectedObjects: [
          { label: 'Ecosystem Flora & Fauna', confidence: 0.96, box_2d: [120, 150, 480, 520] },
          { label: 'Water Resource/Energy Flow', confidence: 0.91, box_2d: [420, 80, 800, 720] }
        ],
        udlActivities: [
          'Tactile mapping of the visual food web diagram',
          'Multilingual audio description of the energy cycles',
          'Interactive student labeling station with physical cards'
        ],
        simulated: true
      });
    }

    // Clean base64 string if it contains data URI prefix
    const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, '');

    const imagePart = {
      inlineData: {
        mimeType: mimeType,
        data: cleanBase64,
      },
    };

    const visionPrompt = prompt || 
      `You are an expert Computer Vision & UDL Instructional Design specialist.
Analyze this image thoroughly for classroom instruction and Universal Design for Learning (CAST 3.0).
Provide:
1. Visual Recognition & Object Detection: List prominent objects, subjects, diagrams, text, or phenomena visible.
2. Academic Concepts: What standards, scientific/mathematical or literary principles are illustrated?
3. Anticipated Sensory/Perceptual Barriers: What might a student with visual, cognitive, or linguistic differences struggle to see or comprehend?
4. Purposeful UDL Activity Suggestions:
   - Engagement (The WHY): Real-world inquiry question or student-choice challenge based on this image.
   - Representation (The WHAT): Multi-sensory alternative (audio description, tactile diagram, vocabulary breakdown).
   - Action & Expression (The HOW): Student creation activity (modeling, narrating, creating a digital or physical prototype).
5. Alt-Text & Audio Description for accessibility.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: {
        parts: [imagePart, { text: visionPrompt }],
      },
      config: {
        temperature: 0.4,
      },
    });

    res.json({
      text: response.text || '',
      simulated: false,
    });
  } catch (error) {
    handleError(res, error, 'Failed computer vision analysis');
  }
});

// 5. High-Quality Image Generation (gemini-nano-banana-2.1 or gemini-3-pro-image)
app.post('/api/gemini/image', async (req: Request, res: Response) => {
  try {
    const { prompt, aspectRatio = '1:1', imageSize = '1K', model = 'gemini-nano-banana-2.1' } = req.body;

    if (!apiKey) {
      // Return high quality educational SVG placeholder
      const placeholderSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="100%" height="100%" fill="%23e0f2fe"/><text x="50%" y="45%" font-family="sans-serif" font-size="22" font-weight="bold" fill="%230284c7" text-anchor="middle">UDL Learning Asset</text><text x="50%" y="60%" font-family="sans-serif" font-size="14" fill="%23475569" text-anchor="middle">${encodeURIComponent(prompt.slice(0, 45))}</text></svg>`;
      return res.status(200).json({
        imageUrl: placeholderSvg,
        prompt,
        aspectRatio,
        imageSize,
        simulated: true
      });
    }

    const selectedModel = model === 'gemini-3-pro-image-preview' ? 'gemini-3-pro-image' : 'gemini-nano-banana-2.1';

    const response = await ai.models.generateContent({
      model: selectedModel,
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio,
          imageSize: imageSize,
        },
      },
    });

    let imageUrl: string | null = null;
    let textOutput = '';

    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          imageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
        } else if (part.text) {
          textOutput += part.text;
        }
      }
    }

    if (!imageUrl) {
      return res.status(400).json({ error: 'No image was generated by the model', textOutput });
    }

    res.json({ imageUrl, prompt, aspectRatio, imageSize, textOutput });
  } catch (error) {
    handleError(res, error, 'Failed to generate image');
  }
});

// 6. A2A (Agent-to-Agent) with Judge Agent (Self-Debugging, Verification & Error Removal)
app.post('/api/a2a/judge', async (req: Request, res: Response) => {
  try {
    const { lessonPlan, originalGoal, candidateOptions, diagnosticType = 'lesson_quality' } = req.body;

    const judgePrompt = `You are the Lead A2A Judge Agent and Autonomous UDL Systems Supervisor.
Your role:
1. Evaluate candidate UDL options against CAST UDL Guidelines 3.0 and the CLEAR rubric (Connected, Learning-preserving, Equitable, Authentic, Realistic).
2. Detect any "Goal Drift" (where an accommodation or option accidentally lowers cognitive rigor or changes the learning standard).
3. Self-debug and detect errors in the lesson structure, syntax, or accessibility compliance.
4. Issue actionable upgrade scripts, prompt revisions, and a verifiable score from 0-20.

Diagnostic Target:
Original Goal: ${originalGoal || 'Understand ecosystem interdependence'}
Plan Data: ${JSON.stringify(lessonPlan || candidateOptions || {})}

Return a JSON response with:
- overallStatus: "OPTIMAL" | "ATTENTION_NEEDED" | "DRIFT_DETECTED" | "RESOLVED"
- clearScore: number (0-20)
- goalPreservationVerdict: "VERIFIED" | "PARTIAL_DRIFT" | "SEVERE_DRIFT"
- judgeExplanation: string
- selfDebugStepsTaken: string[]
- errorCorrectionLog: { issue: string, resolution: string }[]
- recommendedUpgradePrompt: string`;

    if (!apiKey) {
      return res.status(200).json({
        overallStatus: 'OPTIMAL',
        clearScore: 19,
        goalPreservationVerdict: 'VERIFIED',
        judgeExplanation: 'A2A Judge verified that multiple pathways (auditory, visual, kinesthetic) retain the core cognitive standard without lowering expectation.',
        selfDebugStepsTaken: [
          'Scanned options for implicit accommodation vs modification confusion',
          'Validated WCAG 2.2 contrast and perceptual alternatives',
          'Checked backward design alignment between success criteria and summative task'
        ],
        errorCorrectionLog: [
          {
            issue: 'Option 3 previously allowed simple multiple choice without rationale',
            resolution: 'Self-corrected: updated to require evidence-based justification in student verbal/written response'
          }
        ],
        recommendedUpgradePrompt: 'Include peer-dialogue protocols to foster collaborative learner agency.',
        simulated: true
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: judgePrompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.3,
      },
    });

    try {
      const parsed = JSON.parse(response.text || '{}');
      res.json(parsed);
    } catch {
      res.json({ rawJudgeReport: response.text });
    }
  } catch (error) {
    handleError(res, error, 'A2A Judge Agent failed execution');
  }
});

// Production and Development serving
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Universal Design Lesson Planner running at http://localhost:${port}`);
  });
}

startServer();
