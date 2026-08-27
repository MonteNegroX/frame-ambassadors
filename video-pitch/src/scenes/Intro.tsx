import React from 'react';
import { AbsoluteFill, staticFile, useCurrentFrame, interpolate, useVideoConfig } from 'remotion';
import { Video } from '@remotion/media';

export const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Ken Burns effect: slow zoom from 1 to 1.1
  const zoom = interpolate(frame, [0, durationInFrames], [1, 1.1]);

  // Title fade and scale
  const titleOpacity = interpolate(frame, [0, 20], [0, 1]);
  const titleScale = interpolate(frame, [0, 30], [0.8, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ backgroundColor: '#000', overflow: 'hidden' }}>
      <div style={{ transform: `scale(${zoom})`, width: '100%', height: '100%' }}>
        <Video 
          src={staticFile("1 FRAME LOG IN.mp4")} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
      
      {/* Overlay Title */}
      <AbsoluteFill style={{ 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: 'rgba(0,0,0,0.4)',
        opacity: titleOpacity,
        transform: `scale(${titleScale})`
      }}>
        <div
          style={{
            fontSize: '140px',
            fontWeight: '900',
            color: '#FFD507',
            textShadow: '0 0 50px rgba(255, 213, 7, 0.6)',
            letterSpacing: '10px',
            textAlign: 'center'
          }}
        >
          FRAME OS
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
