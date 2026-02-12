
import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Unified Font VFX Transition System
 * 
 * Logic: Irrespective of the number of letters/words, the animation 
 * will complete within the 'duration' provided.
 */

interface UnifiedFontVFXProps {
  text?: string;
  transitionId?: string;
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: number;
  duration?: number;
  glowColor?: string;
  fontColor?: string;
  fillColor?: string;
  blurAmount?: string;
  loop?: boolean;
  className?: string;
}

export default function UnifiedFontVFX({
  text = "CINEMATIC TYPE",
  transitionId = "TR_01",
  fontFamily = "Inter, sans-serif",
  fontSize = "64px",
  fontWeight = 700,
  duration = 1.0,
  glowColor = "rgba(255,255,255,0.8)",
  fontColor = "#ffffff",
  fillColor = "transparent",
  blurAmount = "12px",
  loop = false,
  className = ""
}: UnifiedFontVFXProps) {

  const letters = text.split("");
  const words = text.split(" ").filter(w => w.length > 0);

  // --- AUTOMATIC TIMING ENGINE ---
  const timings = useMemo(() => {
    const N = letters.length;
    if (N <= 1) return { stagger: 0, itemDuration: duration };
    
    // Allocate 40% of total time to the actual animation of one letter
    // Allocate 60% to the staggering between them
    const itemDuration = duration * 0.4;
    const totalStaggerWindow = duration * 0.6;
    const stagger = totalStaggerWindow / (N - 1);
    
    return { stagger, itemDuration };
  }, [letters.length, duration]);

  const TRANSITIONS: Record<string, any> = {
    TR_01: {
      ease: [0.16, 1, 0.3, 1],
      childHidden: {
        scale: 0.7,
        opacity: 0,
        filter: `blur(${blurAmount})`,
        textShadow: `0 0 25px ${glowColor}`
      },
      childShow: {
        scale: 1,
        opacity: 1,
        filter: "blur(0px)",
        textShadow: `0 0 8px ${glowColor}`,
        transition: { 
          duration: timings.itemDuration,
          repeat: loop ? Infinity : 0,
          repeatType: "mirror"
        }
      }
    },

    TR_02: {
      ease: [0.33, 1, 0.68, 1],
      childHidden: {
        y: 40,
        scale: 0.96,
        opacity: 0,
        filter: `blur(${blurAmount})`,
        textShadow: `0 0 15px ${glowColor}`
      },
      childShow: {
        y: 0,
        scale: 1,
        opacity: 1,
        filter: "blur(0px)",
        textShadow: `0 0 4px ${glowColor}`,
        transition: { 
          duration: timings.itemDuration,
          repeat: loop ? Infinity : 0,
          repeatType: "reverse",
          repeatDelay: 0.5
        }
      }
    },

    TR_03: {
      ease: "easeInOut",
      childHidden: {
        scale: 0.96,
        opacity: 0.8,
        filter: `blur(${blurAmount})`,
        textShadow: `0 0 15px ${glowColor}`
      },
      childShow: {
        scale: 1.05,
        opacity: 1,
        filter: "blur(0px)",
        textShadow: `0 0 10px ${glowColor}`,
        transition: {
          duration: duration,
          repeat: Infinity,
          repeatType: "mirror"
        }
      }
    },

    TR_04: {
      ease: [0.34, 1.56, 0.64, 1],
      childHidden: {
        scale: 0.1,
        opacity: 0,
        filter: `blur(${blurAmount})`,
        textShadow: `0 0 80px ${glowColor}`
      },
      childShow: {
        scale: 1,
        opacity: 1,
        filter: "blur(0px)",
        textShadow: `0 0 18px ${glowColor}`,
        transition: { 
          duration: timings.itemDuration,
          repeat: loop ? Infinity : 0,
          repeatDelay: 1
        }
      }
    },

    TR_05: {
      ease: [0.25, 0.46, 0.45, 0.94],
      childHidden: {
        y: -100,
        opacity: 0,
        filter: `blur(${blurAmount})`,
        textShadow: `0 0 20px ${glowColor}`
      },
      childShow: {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        textShadow: `0 0 5px ${glowColor}`,
        transition: { 
          duration: timings.itemDuration,
          repeat: loop ? Infinity : 0,
          repeatDelay: 0.8
        }
      }
    },

    TR_06: {
      ease: "linear",
      childHidden: {
        opacity: 1,
        filter: `blur(${blurAmount})`,
        textShadow: `0 0 20px ${glowColor}`
      },
      childShow: {
        opacity: [1, 0.45, 1, 0.2, 1, 0.6, 1],
        textShadow: [
          `0 0 10px ${glowColor}`,
          `0 0 30px ${glowColor}`,
          `0 0 10px ${glowColor}`,
          `0 0 2px ${glowColor}`,
          `0 0 10px ${glowColor}`
        ],
        filter: [
          `blur(0px) brightness(1)`,
          `blur(1px) brightness(1.4)`,
          `blur(0px) brightness(1)`,
          `blur(2px) brightness(0.8)`,
          `blur(0px) brightness(1)`
        ],
        transition: {
          duration: duration,
          repeat: Infinity,
          repeatType: "loop",
          ease: "linear"
        }
      }
    },

    TR_07: {
      ease: [0.175, 0.885, 0.32, 1.275],
      childHidden: {
        y: 60,
        scale: 0.2,
        opacity: 0,
        filter: `blur(${blurAmount})`,
        textShadow: `0 12px 30px ${glowColor}`
      },
      childShow: {
        y: 0,
        scale: 1,
        opacity: 1,
        filter: "blur(0px)",
        textShadow: `0 0 8px ${glowColor}`,
        transition: { 
          duration: timings.itemDuration,
          repeat: loop ? Infinity : 0,
          repeatDelay: 1.5
        }
      }
    },

    TR_08: {
      duration: duration
    }
  };

  const T = TRANSITIONS[transitionId] || TRANSITIONS.TR_01;

  if (transitionId === "TR_08") {
    return (
      <div className={`w-full min-h-[1.5em] flex justify-center items-center ${className}`}>
        <WordReplacement
          words={words}
          fontFamily={fontFamily}
          fontSize={fontSize}
          fontWeight={fontWeight}
          totalDuration={duration}
          glowColor={glowColor}
          fontColor={fontColor}
          fillColor={fillColor}
          blurAmount={blurAmount}
          loop={loop}
        />
      </div>
    );
  }

  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: timings.stagger
      }
    }
  };

  const child = {
    hidden: T.childHidden,
    show: {
      ...T.childShow,
      transition: {
        ...(T.childShow.transition || {}),
        ease: T.ease
      }
    }
  };

  return (
    <div className={`w-full flex justify-center items-center overflow-visible ${className}`}>
      <AnimatePresence mode="wait">
        <motion.h1
          key={`${text}-${transitionId}-${loop}-${glowColor}-${duration}-${fontColor}-${fillColor}-${fontSize}`}
          variants={container}
          initial="hidden"
          animate="show"
          exit="hidden"
          style={{
            fontFamily,
            fontSize,
            fontWeight,
            color: fontColor,
            backgroundColor: fillColor,
            // Use inline-flex to ensure the background tightly wraps only the text area
            display: "inline-flex",
            flexWrap: "wrap",
            justifyContent: "center",
            padding: fillColor !== 'transparent' ? '0.15em 0.4em' : '0',
            borderRadius: '0.15em',
            letterSpacing: "0.02em",
            textAlign: "center",
            lineHeight: 1.1,
            textTransform: 'none' // Respect lowercase/uppercase as typed
          }}
          className="select-none pointer-events-none"
        >
          {letters.map((letter, i) => (
            <motion.span
              key={`${i}-${letter}`}
              variants={child}
              style={{ display: "inline-block", willChange: "transform, opacity, filter" }}
            >
              {letter === " " ? "\u00A0" : letter}
            </motion.span>
          ))}
        </motion.h1>
      </AnimatePresence>
    </div>
  );
}

/** 
 * Word Swapper logic for TR_08 (Word Build)
 * Ensures the entire word list cycles within totalDuration.
 */
function WordReplacement({ words, fontFamily, fontSize, fontWeight, totalDuration, glowColor, fontColor, fillColor, blurAmount, loop }: { 
  words: string[], 
  fontFamily: string, 
  fontSize: string, 
  fontWeight: number, 
  totalDuration: number, 
  glowColor: string,
  fontColor: string,
  fillColor: string,
  blurAmount: string,
  loop: boolean 
}) {
  const [index, setIndex] = useState(0);

  // Split totalDuration equally among all words
  const wordCycleTime = totalDuration / Math.max(words.length, 1);
  // Allocate 70% of each cycle to the animation and 30% to the static "reading" time
  const animDuration = wordCycleTime * 0.7;

  useEffect(() => {
    setIndex(0);
  }, [words.join(" "), totalDuration]);

  useEffect(() => {
    if (words.length <= 1 && !loop) return;

    const timer = setTimeout(() => {
      if (index < words.length - 1) {
        setIndex(i => i + 1);
      } else if (loop) {
        setIndex(0);
      }
    }, wordCycleTime * 1000);

    return () => clearTimeout(timer);
  }, [index, words.length, wordCycleTime, loop]);

  if (words.length === 0) return null;

  return (
    <div className="relative flex justify-center items-center w-full">
      <AnimatePresence mode="wait">
        <motion.h1
          key={index}
          initial={{ 
            opacity: 0, 
            x: 80, 
            filter: `blur(${blurAmount})`, 
            textShadow: `0 0 30px ${glowColor}` 
          }}
          animate={{ 
            opacity: 1, 
            x: 0, 
            filter: "blur(0px)", 
            textShadow: `0 0 12px ${glowColor}` 
          }}
          exit={{ 
            opacity: 0, 
            x: -20, 
            filter: `blur(${blurAmount})`, 
            textShadow: `0 0 10px ${glowColor}`,
            transition: { duration: animDuration * 0.4 } 
          }}
          transition={{ 
            duration: animDuration, 
            ease: [0.16, 1, 0.3, 1] 
          }}
          style={{
            fontFamily,
            fontSize,
            fontWeight,
            color: fontColor,
            backgroundColor: fillColor,
            display: "inline-block",
            padding: fillColor !== 'transparent' ? '0.15em 0.4em' : '0',
            borderRadius: '0.15em',
            position: "absolute",
            textAlign: "center",
            textTransform: 'none'
          }}
          className="select-none whitespace-nowrap"
        >
          {words[index]}
        </motion.h1>
      </AnimatePresence>
      <h1 style={{ fontFamily, fontSize, fontWeight, opacity: 0, pointerEvents: "none" }}>X</h1>
    </div>
  );
}
