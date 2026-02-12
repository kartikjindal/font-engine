
export interface RemotionCaption {
  id: string;
  content: string | string[];
  totalDuration: number; // seconds
  startTime: number; // seconds
  vfxStyle: 'tr_01' | 'tr_02' | 'tr_03' | 'tr_04' | 'tr_05' | 'tr_06' | 'tr_07' | 'tr_08';
  fontColor: string;
  backgroundColor?: string;
  fontFamily: string;
  fontSize: number;
  position: {
    x: number; // percentage (0-100)
    y: number; // percentage (0-100)
  };
  boxVertices?: {
    top_left: { x: number; y: number };
    top_right: { x: number; y: number };
    bottom_right: { x: number; y: number };
    bottom_left: { x: number; y: number };
  };
  blurIntensity: number; // 0 - 20
  glowTint: string; // hex
  sfxId?: string;
  sfxGain?: number; // dB
}

export const VFX_STYLES = [
  { id: 'tr_01', name: 'TR_01: Cinematic Resolve' },
  { id: 'tr_02', name: 'TR_02: Rising Blur' },
  { id: 'tr_03', name: 'TR_03: Ethereal Pulse' },
  { id: 'tr_04', name: 'TR_04: Flare Zoom' },
  { id: 'tr_05', name: 'TR_05: Heavy Drop' },
  { id: 'tr_06', name: 'TR_06: Glitch Flicker' },
  { id: 'tr_07', name: 'TR_07: Elastic Pop' },
  { id: 'tr_08', name: 'TR_08: Word Swapper' },
];

export const FONT_OPTIONS = [
  { name: 'Lexend', value: '"Lexend", sans-serif' },
  { name: 'Inter', value: '"Inter", sans-serif' },
  { name: 'Montserrat', value: '"Montserrat", sans-serif' },
  { name: 'Outfit', value: '"Outfit", sans-serif' },
  { name: 'Space Grotesk', value: '"Space Grotesk", sans-serif' },
  { name: 'Cinzel', value: '"Cinzel", serif' },
  { name: 'Syncopate', value: '"Syncopate", sans-serif' },
  { name: 'Bebas Neue', value: '"Bebas Neue", sans-serif' },
  { name: 'Orbitron', value: '"Orbitron", sans-serif' },
  { name: 'Permanent Marker', value: '"Permanent Marker", cursive' },
];
