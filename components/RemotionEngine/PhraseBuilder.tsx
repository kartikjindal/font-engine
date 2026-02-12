
import React from 'react';
import { RemotionCaption } from '../../types';
import { CaptionVfxRenderer } from './CaptionVfxRenderer';
import { useRemotionConfig } from './CaptionTimelineController';

interface Props {
  caption: RemotionCaption;
  currentFrame: number;
}

export const PhraseBuilder: React.FC<Props> = ({ caption, currentFrame }) => {
  const { fps } = useRemotionConfig();
  const startFrame = Math.floor(caption.startTime * fps);
  const durationFrames = Math.floor(caption.totalDuration * fps);
  const relativeFrame = currentFrame - startFrame;

  // Visibility window check
  if (relativeFrame < 0 || relativeFrame > durationFrames) {
    return null;
  }

  let displayContent: string = "";

  if (typeof caption.content === 'string') {
    const words = caption.content.split(' ').filter(w => w.length > 0);
    
    if (caption.vfxStyle === 'tr_08') {
      // WORD SWAPPER LOGIC (Replacement)
      // Cycle through individual words based on total duration
      const framesPerWord = durationFrames / Math.max(words.length, 1);
      const wordIndex = Math.min(words.length - 1, Math.floor(relativeFrame / framesPerWord));
      displayContent = words[wordIndex] || "";
    } else {
      // PROGRESSIVE APPEND LOGIC (Standard for other styles)
      // Use 70% of duration for the build, 30% to let the final sentence sit
      const buildDurationFrames = durationFrames * 0.7;
      const framesPerWord = buildDurationFrames / Math.max(words.length, 1);
      const wordsToShow = Math.min(words.length, Math.floor(relativeFrame / framesPerWord) + 1);
      displayContent = words.slice(0, wordsToShow).join(' ');
    }
  } else if (Array.isArray(caption.content)) {
    // Sequential Phrase Logic
    const framesPerPhrase = durationFrames / caption.content.length;
    const phraseIndex = Math.min(caption.content.length - 1, Math.floor(relativeFrame / framesPerPhrase));
    displayContent = caption.content[phraseIndex];
  }

  const modifiedCaption = { ...caption, content: displayContent };

  return <CaptionVfxRenderer caption={modifiedCaption} relativeFrame={relativeFrame} />;
};
