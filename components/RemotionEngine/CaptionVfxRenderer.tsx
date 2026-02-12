
import React from 'react';
import { interpolate, spring, Easing } from 'remotion';
import { RemotionCaption } from '../../types';
import { useRemotionConfig } from './CaptionTimelineController';

interface Props {
  caption: RemotionCaption;
  relativeFrame: number;
}

export const CaptionVfxRenderer: React.FC<Props> = ({ caption, relativeFrame }) => {
  const { fps } = useRemotionConfig();
  const durationInFrames = Math.floor(caption.totalDuration * fps);
  
  // Timing breakpoints for the entire caption lifecycle
  const entranceFrames = Math.min(25, Math.floor(durationInFrames * 0.2));
  const exitFrames = Math.min(20, Math.floor(durationInFrames * 0.15));
  const exitStartFrame = durationInFrames - exitFrames;

  // Global Progress for the entire caption's exit
  const isExitingGlobal = relativeFrame >= exitStartFrame;
  const globalExitProgress = isExitingGlobal 
    ? interpolate(relativeFrame, [exitStartFrame, durationInFrames], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 0;

  // Defaults
  let opacity = 1;
  let scale = 1;
  let blur = 0;
  let xOffset = 0;
  let yOffset = 0;
  let textShadow = `0 0 10px ${caption.glowTint}`;
  const easeOutExpo = Easing.bezier(0.16, 1, 0.3, 1);

  // Box Constraint Logic
  const box = caption.boxVertices;
  const boxWidthPercent = box ? (box.top_right.x - box.top_left.x) * 100 : 90;
  const boxHeightPercent = box ? (box.bottom_left.y - box.top_left.y) * 100 : undefined;

  // Switch VFX Logic
  switch (caption.vfxStyle) {
    case 'tr_01': { // Cinematic Resolve
      const entOp = interpolate(relativeFrame, [0, entranceFrames], [0, 1], { extrapolateRight: 'clamp', easing: easeOutExpo });
      const entBlur = interpolate(relativeFrame, [0, entranceFrames], [caption.blurIntensity, 0], { extrapolateRight: 'clamp' });
      const entScale = interpolate(relativeFrame, [0, entranceFrames], [0.7, 1], { extrapolateRight: 'clamp', easing: easeOutExpo });
      const idleScale = interpolate(relativeFrame, [0, durationInFrames], [1, 1.1]);
      const idleGlow = interpolate(Math.sin(relativeFrame / 10), [-1, 1], [5, 15]);
      opacity = isExitingGlobal ? (1 - globalExitProgress) : entOp;
      blur = isExitingGlobal ? globalExitProgress * 20 : entBlur;
      scale = isExitingGlobal ? (idleScale - (globalExitProgress * 0.1)) : (entScale * idleScale);
      textShadow = `0 0 ${idleGlow}px ${caption.glowTint}`;
      break;
    }

    case 'tr_02': { // Rising Blur
      const entY = interpolate(relativeFrame, [0, entranceFrames], [40, 0], { extrapolateRight: 'clamp', easing: easeOutExpo });
      const entOp = interpolate(relativeFrame, [0, entranceFrames * 0.6], [0, 1], { extrapolateRight: 'clamp' });
      const idleY = interpolate(relativeFrame, [0, durationInFrames], [0, -20]);
      opacity = isExitingGlobal ? (1 - globalExitProgress) : entOp;
      yOffset = isExitingGlobal ? (idleY - (globalExitProgress * 40)) : (entY + idleY);
      blur = isExitingGlobal ? (globalExitProgress * 15) : interpolate(relativeFrame, [0, 10], [caption.blurIntensity || 10, 0], { extrapolateRight: 'clamp' });
      break;
    }

    case 'tr_03': { // Ethereal Pulse
      const pulse = Math.sin((relativeFrame / 20) * Math.PI);
      scale = interpolate(pulse, [-1, 1], [0.98, 1.05]);
      opacity = isExitingGlobal ? (1 - globalExitProgress) : interpolate(pulse, [-1, 1], [0.7, 1]);
      textShadow = `0 0 ${interpolate(pulse, [-1, 1], [2, 25])}px ${caption.glowTint}`;
      blur = isExitingGlobal ? (globalExitProgress * 10) : 0;
      break;
    }

    case 'tr_04': { // Flare Zoom
      const entScale = interpolate(relativeFrame, [0, 15], [0.1, 1], { extrapolateRight: 'clamp', easing: Easing.bezier(0.34, 1.56, 0.64, 1) });
      const idleGlow = interpolate(Math.sin(relativeFrame / 5), [-1, 1], [10, 40]);
      opacity = isExitingGlobal ? (1 - globalExitProgress) : 1;
      scale = isExitingGlobal ? (1 + globalExitProgress * 0.5) : entScale;
      blur = isExitingGlobal ? (globalExitProgress * 30) : interpolate(relativeFrame, [0, 15], [20, 0], { extrapolateRight: 'clamp' });
      textShadow = `0 0 ${idleGlow}px ${caption.glowTint}`;
      break;
    }

    case 'tr_05': { // Heavy Drop
      const dropY = interpolate(relativeFrame, [0, 12], [-150, 0], { extrapolateRight: 'clamp', easing: Easing.bounce });
      const impactFrame = 12;
      let shake = 0;
      if (relativeFrame >= impactFrame && relativeFrame < impactFrame + 10) {
        shake = Math.sin(relativeFrame * 2) * 5;
      }
      opacity = isExitingGlobal ? (1 - globalExitProgress) : 1;
      yOffset = isExitingGlobal ? (globalExitProgress * 100) : (dropY + shake);
      break;
    }

    case 'tr_06': { // Glitch Flicker
      const flicker = Math.sin(relativeFrame * 0.8) + Math.sin(relativeFrame * 1.5);
      opacity = (flicker > 0 ? 1 : 0.3) * (1 - globalExitProgress);
      if (Math.random() > 0.85) xOffset = (Math.random() - 0.5) * 20;
      if (Math.random() > 0.95) yOffset = (Math.random() - 0.5) * 10;
      textShadow = flicker > 0.4 
        ? `3px 0 0 rgba(255,0,0,0.7), -3px 0 0 rgba(0,255,255,0.7), 0 0 15px ${caption.glowTint}`
        : `0 0 5px ${caption.glowTint}`;
      break;
    }

    case 'tr_07': { // Elastic Pop
      const entScale = spring({
        frame: relativeFrame,
        fps,
        config: { stiffness: 180, damping: 12 },
      });
      const idlePulse = 1 + (Math.sin(relativeFrame / 15) * 0.02);
      opacity = isExitingGlobal ? (1 - globalExitProgress) : 1;
      scale = isExitingGlobal ? (entScale * 0.8) : (entScale * idlePulse);
      yOffset = isExitingGlobal ? (globalExitProgress * 50) : 0;
      break;
    }

    case 'tr_08': { // Word Swapper
      const rawText = typeof caption.content === 'string' ? caption.content : "";
      const words = rawText.split(' ').filter(w => w.length > 0);
      const wordCount = words.length || 1;
      const framesPerWord = durationInFrames / wordCount;
      const cycle = relativeFrame % framesPerWord;
      
      const wordInFrames = framesPerWord * 0.2;
      const wordOutFrames = framesPerWord * 0.2;
      const wordOutStart = framesPerWord - wordOutFrames;

      xOffset = 0; 
      const popInY = interpolate(cycle, [0, wordInFrames], [15, 0], { extrapolateRight: 'clamp', easing: easeOutExpo });
      const popOutY = interpolate(cycle, [wordOutStart, framesPerWord], [0, -10], { extrapolateLeft: 'clamp', easing: Easing.in(Easing.ease) });
      yOffset = cycle < framesPerWord / 2 ? popInY : popOutY;

      const wordOpacity = interpolate(cycle, 
        [0, wordInFrames * 0.4, wordOutStart + (wordOutFrames * 0.6), framesPerWord], 
        [0, 1, 1, 0], 
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
      );

      scale = interpolate(cycle, [0, framesPerWord], [0.98, 1.06]);

      const blurIn = interpolate(cycle, [0, wordInFrames], [12, 0], { extrapolateRight: 'clamp' });
      const blurOut = interpolate(cycle, [wordOutStart, framesPerWord], [0, 12], { extrapolateLeft: 'clamp' });
      blur = cycle < framesPerWord / 2 ? blurIn : blurOut;

      opacity = wordOpacity * (1 - globalExitProgress);
      break;
    }

    default:
      opacity = (1 - globalExitProgress);
  }

  return (
    <div
      style={{
        position: 'absolute',
        left: `${caption.position.x}%`,
        top: `${caption.position.y}%`,
        transform: `translate(-50%, -50%) scale(${scale}) translate(${xOffset}px, ${yOffset}px)`,
        opacity,
        fontFamily: caption.fontFamily,
        fontSize: `${caption.fontSize}px`,
        color: caption.fontColor,
        fontWeight: 900,
        filter: `blur(${blur}px)`,
        textShadow,
        backgroundColor: caption.backgroundColor || 'transparent',
        padding: '0.2em 0.5em',
        borderRadius: '0.15em',
        textAlign: 'center',
        whiteSpace: 'nowrap',
        width: 'auto',
        maxWidth: `${boxWidthPercent}%`,
        maxHeight: boxHeightPercent ? `${boxHeightPercent}%` : 'none',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        zIndex: 100,
        willChange: 'transform, opacity, filter',
      }}
    >
      <span style={{ 
        maxWidth: '100%', 
        maxHeight: '100%', 
        overflow: 'hidden', 
        textOverflow: 'ellipsis'
      }}>
        {caption.content}
      </span>
    </div>
  );
};
