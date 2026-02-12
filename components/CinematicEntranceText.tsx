
import React from 'react';
import { motion, Variants } from 'framer-motion';

interface Props {
  text?: string;
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: number;
  staggerDelay?: number;
  duration?: number;
  blurAmount?: string;
  glowColor?: string;
  className?: string;
}

export default function TR01CinematicEntranceText({
  text = "CINEMATIC TYPE",
  fontFamily = "Inter, sans-serif",
  fontSize = "64px",
  fontWeight = 700,
  staggerDelay = 0.2,
  duration = 0.8,
  blurAmount = "12px",
  glowColor = "rgba(255,255,255,0.9)",
  className = ""
}: Props) {
  const letters = text.split("");
  
  // Ease-Out-Expo approximation: explicitly typed as a tuple for Framer Motion Easing compatibility
  const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

  const container: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: staggerDelay
      }
    }
  };

  const child: Variants = {
    hidden: {
      scale: 0.7,
      opacity: 0,
      filter: `blur(${blurAmount})`,
      textShadow: `0px 0px 25px ${glowColor}`
    },
    show: {
      scale: 1,
      opacity: 1,
      filter: "blur(0px)",
      textShadow: "0px 0px 6px rgba(255,255,255,0.35)",
      transition: {
        duration: duration,
        ease: easeOutExpo
      }
    }
  };

  return (
    <div className={`w-full flex justify-center items-center ${className}`}>
      <motion.h1
        key={text} // Force re-animation on text change
        variants={container}
        initial="hidden"
        animate="show"
        style={{
          fontFamily,
          fontSize,
          fontWeight,
          letterSpacing: "0.04em",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "0.02em"
        }}
        className="text-white select-none text-center"
      >
        {letters.map((letter, i) => (
          <motion.span
            key={i}
            variants={child}
            style={{ display: "inline-block" }}
          >
            {letter === " " ? "\u00A0" : letter}
          </motion.span>
        ))}
      </motion.h1>
    </div>
  );
}
