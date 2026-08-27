import React from 'react';
import { AbsoluteFill, staticFile, useCurrentFrame, interpolate, useVideoConfig } from 'remotion';
import { Video } from '@remotion/media';

export const TasksScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const zoom = interpolate(frame, [0, durationInFrames], [1.1, 1], {
    easing: (t) => t,
  });

  return (
    <AbsoluteFill style={{ backgroundColor: '#000', overflow: 'hidden' }}>
      <div style={{ transform: `scale(${zoom})`, width: '100%', height: '100%' }}>
        <Video 
          src={staticFile("2 FRAME PRIVY PROFILE.mp4")} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
      
      {/* Tech Overlay: Scanlines */}
      <AbsoluteFill style={{
        pointerEvents: 'none',
        background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.1) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03))',
        backgroundSize: '100% 4px, 3px 100%',
      }} />
    </AbsoluteFill>
  );
};
