import { AbsoluteFill, Sequence, useVideoConfig, useCurrentFrame, interpolate } from "remotion";
import { Intro } from "./scenes/Intro";
import { LeaderboardScene } from "./scenes/LeaderboardScene";
import { TasksScene } from "./scenes/TasksScene";
import { IdentityScene } from "./scenes/IdentityScene";
import { Outro } from "./scenes/Outro";
import { Captions } from "./components/Captions";

export const PitchVideo: React.FC = () => {
  const { fps } = useVideoConfig();

  // Scene durations in seconds
  const introDuration = 4;
  const tasksDuration = 6;
  const identityDuration = 20;
  const leaderboardDuration = 7;
  const outroDuration = 5;

  const transitionFrames = 15; // 0.5s transition

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000", fontFamily: "'IBM Plex Mono', monospace" }}>
      {/* 1. Intro */}
      <Sequence from={0} durationInFrames={introDuration * fps + transitionFrames}>
        <Intro />
      </Sequence>

      {/* 2. Tasks */}
      <Sequence 
        from={introDuration * fps} 
        durationInFrames={tasksDuration * fps + transitionFrames}
      >
        <SceneTransition duration={transitionFrames}>
          <TasksScene />
        </SceneTransition>
      </Sequence>

      {/* 3. Identity */}
      <Sequence 
        from={(introDuration + tasksDuration) * fps} 
        durationInFrames={identityDuration * fps + transitionFrames}
      >
        <SceneTransition duration={transitionFrames}>
          <IdentityScene />
        </SceneTransition>
      </Sequence>

      {/* 4. Leaderboard */}
      <Sequence 
        from={(introDuration + tasksDuration + identityDuration) * fps} 
        durationInFrames={leaderboardDuration * fps + transitionFrames}
      >
        <SceneTransition duration={transitionFrames}>
          <LeaderboardScene />
        </SceneTransition>
      </Sequence>

      {/* 5. Outro */}
      <Sequence 
        from={(introDuration + tasksDuration + identityDuration + leaderboardDuration) * fps} 
        durationInFrames={outroDuration * fps}
      >
        <SceneTransition duration={transitionFrames}>
          <Outro />
        </SceneTransition>
      </Sequence>

      {/* Global Captions Overlay */}
      <AbsoluteFill style={{ pointerEvents: 'none' }}>
        <Captions />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const SceneTransition: React.FC<{ children: React.ReactNode; duration: number }> = ({ children, duration }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, duration], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ opacity }}>
      {children}
    </AbsoluteFill>
  );
};
