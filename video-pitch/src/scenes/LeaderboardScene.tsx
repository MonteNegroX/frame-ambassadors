import React from 'react';
import { AbsoluteFill, staticFile, useCurrentFrame, interpolate, useVideoConfig } from 'remotion';
import { Video } from '@remotion/media';

export const LeaderboardScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const zoom = interpolate(frame, [0, durationInFrames], [1, 1.1]);

  return (
    <AbsoluteFill style={{ backgroundColor: '#000', overflow: 'hidden' }}>
      <div style={{ transform: `scale(${zoom})`, width: '100%', height: '100%' }}>
        <Video 
          src={staticFile("4 FRAME LEADERBOARD.mp4")} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      {/* Technical Grid Overlay */}
      <AbsoluteFill style={{
        backgroundImage: 'radial-gradient(#ffffff 1px, transparent 0)',
        backgroundSize: '40px 40px',
        opacity: 0.05,
        pointerEvents: 'none'
      }} />
    </AbsoluteFill>
  );
};
