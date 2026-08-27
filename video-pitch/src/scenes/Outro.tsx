import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, AbsoluteFill, interpolate } from 'remotion';

export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const logoScale = spring({
    fps,
    frame: frame - 5,
    config: { damping: 10, stiffness: 100 },
  });

  const zoom = interpolate(frame, [0, durationInFrames], [1, 1.2]);
  const opacity = interpolate(frame, [durationInFrames - 15, durationInFrames], [1, 0]);

  return (
    <AbsoluteFill style={{ 
      justifyContent: 'center', 
      alignItems: 'center', 
      backgroundColor: '#000',
      opacity 
    }}>
      {/* Background glow animation */}
      <div style={{
        position: 'absolute',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(255, 213, 7, 0.1) 0%, rgba(0,0,0,0) 70%)',
        transform: `scale(${1 + Math.sin(frame / 10) * 0.1})`,
      }} />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          transform: `scale(${logoScale * zoom})`,
        }}
      >
        <div
          style={{
            fontSize: '180px',
            fontWeight: '900',
            color: '#FFD507',
            textShadow: '0 0 80px rgba(255, 213, 7, 0.8)',
            marginBottom: '40px',
            letterSpacing: '15px',
          }}
        >
          FRAME OS
        </div>
        <div
          style={{
            fontSize: '60px',
            color: '#ffffff',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            padding: '20px 60px',
            borderRadius: '15px',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            fontWeight: '900',
            letterSpacing: '2px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
          }}
        >
          waitlist.frameonx.xyz
        </div>
      </div>
    </AbsoluteFill>
  );
};
