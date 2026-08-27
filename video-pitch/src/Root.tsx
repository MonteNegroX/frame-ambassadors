import { Composition } from "remotion";
import { PitchVideo } from "./PitchVideo";
import { loadFont } from "@remotion/google-fonts/IBMPlexMono";
import "./index.css";

loadFont();

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="PitchVideo"
        component={PitchVideo}
        durationInFrames={1260}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
