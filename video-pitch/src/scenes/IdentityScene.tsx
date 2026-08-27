import React from 'react';
import { AbsoluteFill, staticFile, useCurrentFrame, interpolate, useVideoConfig } from 'remotion';
import { Video } from '@remotion/media';

export const IdentityScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  
  // Smooth zoom
  const zoom = interpolate(frame, [0, durationInFrames], [1, 1.1]);

  return (
    <AbsoluteFill style={{ backgroundColor: '#000', overflow: 'hidden' }}>
      <div style={{ 
        transform: `scale(${zoom})`, 
        width: '100%', 
        height: '100%' 
      }}>
        <Video 
          src={staticFile("3 FRAME DASHBOARD + OG CARD.mp4")} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
      
      {/* Vignette Overlay */}
      <AbsoluteFill style={{
        boxShadow: 'inset 0 0 200px rgba(0,0,0,0.8)',
        pointerEvents: 'none'
      }} />
      
      {/* Golden Glow corner */}
      <div style={{
        position: 'absolute',
        bottom: -100,
        right: -100,
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(255, 213, 7, 0.2) 0%, rgba(255, 213, 7, 0) 70%)',
        filter: 'blur(40px)',
      }} />
    </AbsoluteFill>
  );
};
