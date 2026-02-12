
import React, { useState, useEffect, useContext, useRef } from 'react';
import { RemotionCaption } from '../../types';
import { PhraseBuilder } from './PhraseBuilder';

export interface RemotionVideoConfig {
  fps: number;
  durationInFrames: number;
  width: number;
  height: number;
}

export const RemotionContext = React.createContext<RemotionVideoConfig>({ 
  fps: 30, 
  durationInFrames: 300, 
  width: 1080, 
  height: 1920 
});

interface Props {
  captions: RemotionCaption[];
  isPlaying: boolean;
  videoUrl?: string | null;
  onFrameUpdate?: (frame: number) => void;
}

export const CaptionTimelineController: React.FC<Props> = ({ captions, isPlaying, videoUrl, onFrameUpdate }) => {
  const [frame, setFrame] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const sfxPool = useRef<Record<string, HTMLAudioElement>>({});
  const firedSfx = useRef<Set<string>>(new Set());
  const [canvasStyle, setCanvasStyle] = useState<React.CSSProperties>({ width: '100%', height: '100%' });
  const fps = 30;
  
  const maxDuration = Math.max(...captions.map(c => c.startTime + c.totalDuration), 5);
  const totalFrames = Math.floor(maxDuration * fps);

  // SFX Manager: Preload and Unlocking
  useEffect(() => {
    const uniqueSfxIds = Array.from(new Set(captions.map(c => c.sfxId).filter(Boolean)));
    uniqueSfxIds.forEach(id => {
      if (!sfxPool.current[id!]) {
        // We assume files are named exactly as the ID with .mp3 extension in the root
        const audio = new Audio(`./${id}.mp3`);
        audio.preload = 'auto';
        sfxPool.current[id!] = audio;
        
        audio.addEventListener('error', (e) => {
          console.error(`Failed to load SFX: ./${id}.mp3. Ensure the file exists in the public/parent folder.`, e);
        });
      }
    });
  }, [captions]);

  // Audio Unlocking: Browsers require a user gesture to allow audio
  useEffect(() => {
    if (isPlaying) {
      // "Unlock" all audio objects in the pool by playing/pausing quickly or just interacting
      // Explicitly typing audio as HTMLAudioElement to fix TS error: Property 'load' does not exist on type 'unknown'
      Object.values(sfxPool.current).forEach((audio: HTMLAudioElement) => {
        audio.load(); 
      });
    }
  }, [isPlaying]);

  useEffect(() => {
    if (!isPlaying) return;

    // Trigger SFX logic
    captions.forEach(c => {
      if (!c.sfxId) return;

      const startFrame = Math.floor(c.startTime * fps);
      
      // Using >= instead of === to handle potential frame skips
      // Using firedSfx set to ensure each phrase's sound only plays once per loop
      if (frame >= startFrame && frame < startFrame + 5 && !firedSfx.current.has(c.id)) {
        const audio = sfxPool.current[c.sfxId];
        if (audio) {
          // Convert dB to linear volume: vol = 10^(db/20)
          const volume = Math.pow(10, (c.sfxGain || 0) / 20);
          audio.volume = Math.min(1, Math.max(0, volume));
          audio.currentTime = 0;
          
          const playPromise = audio.play();
          if (playPromise !== undefined) {
            playPromise.catch(error => {
              console.warn(`Playback prevented for ${c.sfxId}:`, error);
            });
          }
          firedSfx.current.add(c.id);
        }
      }
    });

    // Reset loop tracking if we wrap around
    if (frame === 0) {
      firedSfx.current.clear();
    }
  }, [frame, isPlaying, captions]);

  const updateCanvasSize = () => {
    if (!videoRef.current || !containerRef.current) return;
    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;
    const videoWidth = videoRef.current.videoWidth || 1080;
    const videoHeight = videoRef.current.videoHeight || 1920;
    const videoRatio = videoWidth / videoHeight;
    const containerRatio = containerWidth / containerHeight;
    let actualWidth, actualHeight;
    if (containerRatio > videoRatio) {
      actualHeight = containerHeight;
      actualWidth = containerHeight * videoRatio;
    } else {
      actualWidth = containerWidth;
      actualHeight = containerWidth / videoRatio;
    }
    setCanvasStyle({ width: `${actualWidth}px`, height: `${actualHeight}px`, position: 'relative' });
  };

  useEffect(() => {
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      const targetTime = frame / fps;
      if (Math.abs(videoRef.current.currentTime - targetTime) > 0.1) {
        videoRef.current.currentTime = targetTime;
      }
      if (isPlaying) videoRef.current.play().catch(() => {});
      else videoRef.current.pause();
    }
  }, [frame, isPlaying]);

  useEffect(() => {
    let interval: number;
    if (isPlaying) {
      interval = window.setInterval(() => {
        setFrame((f) => {
          const next = f + 1 >= totalFrames ? 0 : f + 1;
          if (onFrameUpdate) onFrameUpdate(next);
          return next;
        });
      }, 1000 / fps);
    }
    return () => clearInterval(interval);
  }, [isPlaying, totalFrames, fps, onFrameUpdate]);

  const videoConfig: RemotionVideoConfig = { fps, durationInFrames: totalFrames, width: 1080, height: 1920 };

  return (
    <RemotionContext.Provider value={videoConfig}>
      <div ref={containerRef} className="relative w-full h-full overflow-hidden bg-black flex items-center justify-center">
        <div style={canvasStyle} className="flex items-center justify-center">
          {videoUrl && (
            <video 
              ref={videoRef}
              src={videoUrl}
              onLoadedMetadata={updateCanvasSize}
              className="absolute inset-0 w-full h-full object-contain opacity-70"
              muted
              playsInline
            />
          )}
          <div className="absolute inset-0 w-full h-full z-10 pointer-events-none">
            {captions.map((caption) => (
              <PhraseBuilder key={caption.id} caption={caption} currentFrame={frame} />
            ))}
          </div>
        </div>
        <div className="absolute top-6 right-6 text-[9px] text-white/50 font-mono select-none pointer-events-none bg-black/60 px-3 py-1.5 rounded-full border border-white/5 backdrop-blur-md z-50 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span>FRAME: {frame} / {totalFrames}</span>
          <span className="opacity-30">|</span>
          <span>TIME: {(frame / fps).toFixed(2)}s</span>
        </div>
      </div>
    </RemotionContext.Provider>
  );
};

export const useRemotionConfig = () => useContext(RemotionContext);
