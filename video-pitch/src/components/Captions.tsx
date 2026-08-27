import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

const subtitles = [
  { start: 0, end: 4, text: "FRAME OS: The Web3 Ambassador Protocol" },
  { start: 4, end: 10, text: "Connect your Social Identity via Privy." },
  { start: 10, end: 30, text: "Manage your Campaigns and OG Identity Card." },
  { start: 30, end: 37, text: "Climb the Leaderboard and Earn Smart Tiers." },
  { start: 37, end: 42, text: "Join the Waitlist Now at waitlist.frameonx.xyz" },
];

export const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentTime = frame / fps;

  const activeSubtitle = subtitles.find(
    (sub) => currentTime >= sub.start && currentTime < sub.end
  );

  if (!activeSubtitle) return null;

  // Animate subtitle entry
  const startFrame = activeSubtitle.start * fps;
  const entryAnimation = spring({
    fps,
    frame: frame - startFrame,
    config: { damping: 12, stiffness: 200 },
  });
  
  const opacity = interpolate(frame - startFrame, [0, 10], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const scale = interpolate(entryAnimation, [0, 1], [0.95, 1]);

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 80,
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        opacity,
        transform: `translateY(${(1 - entryAnimation) * 15}px) scale(${scale})`,
      }}
    >
      <div
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: '#FFD507',
          padding: '15px 30px',
          borderRadius: '10px',
          fontSize: '40px',
          fontWeight: 'bold',
          textAlign: 'center',
          maxWidth: '80%',
          border: '2px solid #FFD507',
          textShadow: '0 0 10px rgba(255, 213, 7, 0.5)',
        }}
      >
        {activeSubtitle.text}
      </div>
    </div>
  );
};
