
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, Play, Pause, Type as TypeIcon, 
  Layers, Timer, Upload, Film, Trash2, X, Eye, Monitor, Download, Loader2, FileJson, FileUp
} from 'lucide-react';
import { CaptionTimelineController } from './components/RemotionEngine/CaptionTimelineController';
import { RemotionCaption, VFX_STYLES, FONT_OPTIONS } from './types';
import { generateEpicPhrases } from './services/geminiService';
import { GoogleGenAI } from "@google/genai";

// The Storyboard V3 Data provided by the user (Initial default)
const INITIAL_STORYBOARD_DATA = {
  "timeline": [
    {
      "block_id": "block_001",
      "time_range": [0, 4.4],
      "phrases": [
        { "phrase_id": "p1_1", "phrase_text": "If your life", "start_time": 0, "end_time": 0.72, "font_size_px": 19, "position": { "x": 0.5, "y": 0.85 }, "box_vertices": { "top_left": { "x": 0.1791111111111111, "y": 0.8203125 }, "top_right": { "x": 0.8208888888888889, "y": 0.8203125 }, "bottom_right": { "x": 0.8208888888888889, "y": 0.8796875 }, "bottom_left": { "x": 0.1791111111111111, "y": 0.8796875 } }, "vfx_id": "TR_02", "sfx_id": "sfx_001" },
        { "phrase_id": "p1_2", "phrase_text": "is a mess", "start_time": 0.72, "end_time": 1.28, "font_size_px": 19, "position": { "x": 0.5, "y": 0.85 }, "box_vertices": { "top_left": { "x": 0.25377777777777777, "y": 0.8203125 }, "top_right": { "x": 0.7462222222222222, "y": 0.8203125 }, "bottom_right": { "x": 0.7462222222222222, "y": 0.8796875 }, "bottom_left": { "x": 0.25377777777777777, "y": 0.8796875 } }, "vfx_id": "TR_02", "sfx_id": "sfx_001" },
        { "phrase_id": "p1_3", "phrase_text": "right now,", "start_time": 1.28, "end_time": 2.08, "font_size_px": 19, "position": { "x": 0.5, "y": 0.85 }, "box_vertices": { "top_left": { "x": 0.22888888888888886, "y": 0.8203125 }, "top_right": { "x": 0.7711111111111111, "y": 0.8203125 }, "bottom_right": { "x": 0.7711111111111111, "y": 0.8796875 }, "bottom_left": { "x": 0.22888888888888886, "y": 0.8203125 } }, "vfx_id": "TR_02", "sfx_id": "sfx_001" },
        { "phrase_id": "p1_4", "phrase_text": "just don't quit.", "start_time": 2.08, "end_time": 3.28, "font_size_px": 19, "position": { "x": 0.5, "y": 0.85 }, "box_vertices": { "top_left": { "x": 0.07955555555555549, "y": 0.8203125 }, "top_right": { "x": 0.9204444444444445, "y": 0.8203125 }, "bottom_right": { "x": 0.9204444444444445, "y": 0.8796875 }, "bottom_left": { "x": 0.07955555555555549, "y": 0.8796875 } }, "vfx_id": "TR_02", "sfx_id": "sfx_001" },
        { "phrase_id": "p1_5", "phrase_text": "If your thoughts", "start_time": 3.36, "end_time": 4.08, "font_size_px": 19, "position": { "x": 0.5, "y": 0.85 }, "box_vertices": { "top_left": { "x": 0.07955555555555549, "y": 0.8203125 }, "top_right": { "x": 0.9204444444444445, "y": 0.8203125 }, "bottom_right": { "x": 0.9204444444444445, "y": 0.8796875 }, "bottom_left": { "x": 0.07955555555555549, "y": 0.8796875 } }, "vfx_id": "TR_02", "sfx_id": "sfx_001" },
        { "phrase_id": "p1_6", "phrase_text": "feel", "start_time": 4.08, "end_time": 4.4, "font_size_px": 19, "position": { "x": 0.5, "y": 0.85 }, "box_vertices": { "top_left": { "x": 0.37822222222222224, "y": 0.8203125 }, "top_right": { "x": 0.6217777777777778, "y": 0.8203125 }, "bottom_right": { "x": 0.6217777777777778, "y": 0.8796875 }, "bottom_left": { "x": 0.37822222222222224, "y": 0.8203125 } }, "vfx_id": "TR_02", "sfx_id": "sfx_001" }
      ]
    },
    {
      "block_id": "block_002",
      "time_range": [4.4, 8],
      "phrases": [
        { "phrase_id": "p2_1", "phrase_text": "heavy,", "start_time": 4.4, "end_time": 5.2, "font_size_px": 19, "position": { "x": 0.5, "y": 0.85 }, "box_vertices": { "top_left": { "x": 0.32844444444444443, "y": 0.8203125 }, "top_right": { "x": 0.6715555555555556, "y": 0.8203125 }, "bottom_right": { "x": 0.6715555555555556, "y": 0.8796875 }, "bottom_left": { "x": 0.32844444444444443, "y": 0.8796875 } }, "vfx_id": "TR_02", "sfx_id": "sfx_001" },
        { "phrase_id": "p2_2", "phrase_text": "stick with it.", "start_time": 5.6, "end_time": 6.56, "font_size_px": 19, "position": { "x": 0.5, "y": 0.85 }, "box_vertices": { "top_left": { "x": 0.12933333333333336, "y": 0.8203125 }, "top_right": { "x": 0.8706666666666667, "y": 0.8203125 }, "bottom_right": { "x": 0.8706666666666667, "y": 0.8796875 }, "bottom_left": { "x": 0.12933333333333336, "y": 0.8796875 } }, "vfx_id": "TR_02", "sfx_id": "sfx_001" },
        { "phrase_id": "p2_3", "phrase_text": "If you feel", "start_time": 6.56, "end_time": 7.28, "font_size_px": 19, "position": { "x": 0.5, "y": 0.85 }, "box_vertices": { "top_left": { "x": 0.20400000000000001, "y": 0.8203125 }, "top_right": { "x": 0.796, "y": 0.8203125 }, "bottom_right": { "x": 0.796, "y": 0.8796875 }, "bottom_left": { "x": 0.20400000000000001, "y": 0.8796875 } }, "vfx_id": "TR_02", "sfx_id": "sfx_001" },
        { "phrase_id": "p2_4", "phrase_text": "stuck while", "start_time": 7.28, "end_time": 8, "font_size_px": 19, "position": { "x": 0.5, "y": 0.85 }, "box_vertices": { "top_left": { "x": 0.20400000000000001, "y": 0.8203125 }, "top_right": { "x": 0.796, "y": 0.8203125 }, "bottom_right": { "x": 0.796, "y": 0.8796875 }, "bottom_left": { "x": 0.20400000000000001, "y": 0.8796875 } }, "vfx_id": "TR_02", "sfx_id": "sfx_001" }
      ]
    },
    {
      "block_id": "block_003",
      "time_range": [8, 10.01],
      "phrases": [
        { "phrase_id": "p3_1", "phrase_text": "everyone else", "start_time": 8, "end_time": 8.72, "font_size_px": 19, "position": { "x": 0.5, "y": 0.82 }, "box_vertices": { "top_left": { "x": 0.15422222222222215, "y": 0.7903125 }, "top_right": { "x": 0.8457777777777779, "y": 0.7903125 }, "bottom_right": { "x": 0.8457777777777779, "y": 0.8496874999999999 }, "bottom_left": { "x": 0.15422222222222215, "y": 0.8496874999999999 } }, "vfx_id": "TR_02", "sfx_id": "sfx_001" },
        { "phrase_id": "p3_2", "phrase_text": "is moving,", "start_time": 8.72, "end_time": 10.01, "font_size_px": 19, "position": { "x": 0.5, "y": 0.82 }, "box_vertices": { "top_left": { "x": 0.22888888888888886, "y": 0.7903125 }, "top_right": { "x": 0.7711111111111111, "y": 0.7903125 }, "bottom_right": { "x": 0.7711111111111111, "y": 0.8496874999999999 }, "bottom_left": { "x": 0.22888888888888886, "y": 0.7903125 } }, "vfx_id": "TR_02", "sfx_id": "sfx_001" }
      ]
    }
  ]
};

const parseStoryboard = (data: any): RemotionCaption[] => {
  if (!data?.timeline) {
    throw new Error("Invalid Storyboard format: 'timeline' property is missing.");
  }
  const result: RemotionCaption[] = [];
  data.timeline.forEach((block: any) => {
    if (block.phrases) {
      block.phrases.forEach((phrase: any) => {
        result.push({
          id: phrase.phrase_id,
          content: phrase.phrase_text,
          startTime: phrase.start_time,
          totalDuration: phrase.end_time - phrase.start_time,
          vfxStyle: (phrase.vfx_id || "TR_01").toLowerCase() as any,
          fontColor: phrase.font_color_hex || '#ffffff',
          fontFamily: '"Lexend", sans-serif',
          fontSize: (phrase.font_size_px || 19) * 2.5,
          position: { 
            x: (phrase.position?.x ?? 0.5) * 100, 
            y: (phrase.position?.y ?? 0.85) * 100 
          },
          boxVertices: phrase.box_vertices,
          blurIntensity: 2,
          glowTint: '#ffffff',
          sfxId: phrase.sfx_id,
          sfxGain: phrase.sfx_gain_db || 0
        });
      });
    }
  });
  return result;
};

const INITIAL_CAPTIONS = parseStoryboard(INITIAL_STORYBOARD_DATA);

const App: React.FC = () => {
  const [captions, setCaptions] = useState<RemotionCaption[]>(INITIAL_CAPTIONS);
  const [activeCaptionId, setActiveCaptionId] = useState<string>(INITIAL_CAPTIONS[0]?.id || "");
  const [isPlaying, setIsPlaying] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isCinemaMode, setIsCinemaMode] = useState(false);
  const [isRenderingVideo, setIsRenderingVideo] = useState(false);
  const [renderStatus, setRenderStatus] = useState("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const jsonFileInputRef = useRef<HTMLInputElement>(null);

  const updateCaption = (id: string, updates: Partial<RemotionCaption>) => {
    setCaptions(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setVideoUrl(URL.createObjectURL(file));
  };

  const handleJsonUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        const parsedCaptions = parseStoryboard(json);
        setCaptions(parsedCaptions);
        if (parsedCaptions.length > 0) {
          setActiveCaptionId(parsedCaptions[0].id);
        }
        alert("Storyboard JSON loaded successfully!");
      } catch (err: any) {
        console.error("JSON Parse Error:", err);
        alert(`Failed to load JSON: ${err.message}`);
      }
    };
    reader.readAsText(file);
    // Reset the input value to allow the same file to be uploaded again if needed
    e.target.value = "";
  };

  const renderAIVideo = async () => {
    try {
      // @ts-ignore
      const hasKey = await window.aistudio.hasSelectedApiKey();
      if (!hasKey) {
        // @ts-ignore
        await window.aistudio.openSelectKey();
      }

      setIsRenderingVideo(true);
      setRenderStatus("Initializing Render Engine...");
      
      // Creating a new GoogleGenAI instance right before the API call to ensure latest API key
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const mainPrompt = captions.map(c => typeof c.content === 'string' ? c.content : c.content.join(' ')).join('. ');
      
      setRenderStatus("Synthesizing Cinematic Motion...");
      
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: `A cinematic scene matching these captions: ${mainPrompt}. Professional color grading, high contrast, 4k.`,
        config: {
          numberOfVideos: 1,
          resolution: '1080p',
          aspectRatio: '16:9'
        }
      });

      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({operation: operation});
      }

      setRenderStatus("Ready for Download!");
      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      
      if (downloadLink) {
        const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `vfx_render_${Date.now()}.mp4`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setVideoUrl(url); 
      }
    } catch (error: any) {
      console.error("Render Error:", error);
      // If the request fails with an error message containing "Requested entity was not found.", reset the key selection state and prompt the user to select a key again via openSelectKey().
      if (error.message?.includes("Requested entity was not found.")) {
        // @ts-ignore
        await window.aistudio.openSelectKey();
      }
      alert("Render encountered an error.");
    } finally {
      setIsRenderingVideo(false);
      setRenderStatus("");
    }
  };

  const activeCap = captions.find(c => c.id === activeCaptionId) || captions[0];

  return (
    <div className={`h-screen w-full bg-black text-gray-100 font-sans flex flex-col md:flex-row overflow-hidden ${isCinemaMode ? 'cursor-none' : ''}`}>
      
      <AnimatePresence>
        {isRenderingVideo && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[1000] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-10 text-center">
            <div className="relative w-32 h-32 mb-8">
               <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="absolute inset-0 border-4 border-white/5 border-t-blue-500 rounded-full" />
               <div className="absolute inset-0 flex items-center justify-center"><Loader2 className="w-10 h-10 text-blue-500 animate-spin" /></div>
            </div>
            <h2 className="text-3xl font-black tracking-tighter mb-4 italic uppercase">VFX MASTER RENDER</h2>
            <p className="text-gray-500 text-sm font-mono tracking-widest">{renderStatus}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {!isCinemaMode && isSidebarOpen && (
          <motion.aside initial={{ width: 0, opacity: 0 }} animate={{ width: 340, opacity: 1 }} exit={{ width: 0, opacity: 0 }} className="bg-[#0a0a0a] border-r border-white/5 h-full z-40 flex-shrink-0 relative flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8 pb-32">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <FileJson className="w-5 h-5 text-blue-500" />
                  <h1 className="text-lg font-black tracking-tighter uppercase italic">VFX ENGINE V3</h1>
                </div>
                <button onClick={() => setIsSidebarOpen(false)} className="p-1 hover:bg-white/10 rounded transition-colors"><X className="w-4 h-4 text-gray-500" /></button>
              </div>

              <section className="bg-white/5 border border-white/10 p-4 rounded-xl space-y-3">
                 <button onClick={() => jsonFileInputRef.current?.click()} className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all active:scale-95 text-xs">
                   <FileUp className="w-4 h-4 text-yellow-500" />
                   UPLOAD STORYBOARD JSON
                 </button>
                 <input type="file" ref={jsonFileInputRef} onChange={handleJsonUpload} accept=".json" className="hidden" />

                 <button onClick={renderAIVideo} disabled={isRenderingVideo} className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-black py-3 rounded-lg flex items-center justify-center gap-2 transition-all active:scale-95 text-xs shadow-lg shadow-blue-600/20">
                   {isRenderingVideo ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                   {isRenderingVideo ? 'SYNCING...' : 'EXPORT FINAL MP4'}
                 </button>
              </section>

              <section className="space-y-3">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                  <Layers className="w-3 h-3 text-yellow-400" /> PHRASE FLOW
                </label>
                <div className="space-y-1 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
                  {captions.map((c, i) => (
                    <div key={c.id} onClick={() => setActiveCaptionId(c.id)} className={`group flex items-center justify-between p-2.5 rounded-lg border cursor-pointer transition-all ${activeCaptionId === c.id ? 'bg-white/10 border-white/30' : 'bg-white/5 border-transparent hover:bg-white/10'}`}>
                      <div className="flex flex-col gap-0.5 overflow-hidden">
                        <span className="text-[10px] font-bold truncate">"{c.content}"</span>
                        <span className="text-[8px] text-gray-500 font-mono tracking-tighter">{c.startTime.toFixed(2)}s | {c.sfxId || 'NO SFX'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="space-y-4">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                  <Timer className="w-3 h-3 text-green-400" /> PHRASE SETTINGS
                </label>
                {activeCap && (
                  <div className="space-y-4">
                    <div className="bg-white/5 p-3 rounded-lg border border-white/10 space-y-2">
                        <label className="text-[9px] text-gray-500 uppercase">Text</label>
                        <input type="text" value={activeCap.content as string} onChange={(e) => updateCaption(activeCap.id, { content: e.target.value })} className="w-full bg-transparent border-none text-sm focus:ring-0 p-0 font-bold" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1"><span className="text-[9px] text-gray-500">Font Size</span><input type="range" min="8" max="120" value={activeCap.fontSize} onChange={(e) => updateCaption(activeCap.id, { fontSize: parseInt(e.target.value) })} className="w-full accent-white h-1 bg-white/10 rounded appearance-none cursor-pointer" /></div>
                        <div className="space-y-1"><span className="text-[9px] text-gray-500">Blur</span><input type="range" min="0" max="40" value={activeCap.blurIntensity} onChange={(e) => updateCaption(activeCap.id, { blurIntensity: parseInt(e.target.value) })} className="w-full accent-white h-1 bg-white/10 rounded appearance-none cursor-pointer" /></div>
                    </div>
                  </div>
                )}
              </section>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/90 to-transparent pt-12 pointer-events-none">
              <button onClick={() => setIsPlaying(!isPlaying)} className={`w-full font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-2xl pointer-events-auto ${isPlaying ? 'bg-red-600/10 text-red-500 border border-red-500/20 hover:bg-red-600/20' : 'bg-white text-black hover:bg-gray-200'}`}>
                {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                {isPlaying ? 'PAUSE PREVIEW' : 'START PREVIEW'}
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <main className="flex-1 relative flex flex-col items-center justify-center overflow-hidden bg-[#020202]">
        <div className={`transition-all duration-1000 w-full h-full flex items-center justify-center ${isCinemaMode ? 'p-0' : 'p-10 lg:p-20'}`}>
           <div className={`relative shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden transition-all duration-700 ${isCinemaMode ? 'w-full h-full' : 'aspect-[9/16] h-full max-h-[850px] rounded-[40px] border border-white/10 bg-black ring-1 ring-white/5'}`}>
              <CaptionTimelineController captions={captions} isPlaying={isPlaying} videoUrl={videoUrl} />
           </div>
        </div>

        {!isCinemaMode && (
          <nav className="absolute top-0 left-0 right-0 p-8 flex justify-between items-center z-50 pointer-events-none">
            <div className="flex gap-3 pointer-events-auto">
              <button onClick={() => fileInputRef.current?.click()} className="p-4 bg-black/60 backdrop-blur-2xl border border-white/10 rounded-3xl text-blue-400 hover:bg-white/10 transition-all active:scale-90 flex items-center gap-3 px-6 shadow-xl">
                <Upload className="w-5 h-5" /><span className="text-[10px] font-black uppercase tracking-[0.2em]">{videoUrl ? 'SWAP RAW FOOTAGE' : 'LOAD BASE VIDEO'}</span>
              </button>
              <input type="file" ref={fileInputRef} onChange={handleVideoUpload} accept="video/mp4,video/webm" className="hidden" />
            </div>
          </nav>
        )}
      </main>
    </div>
  );
};

export default App;
