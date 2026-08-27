import { getVideoMetadata } from "@remotion/media";
import path from "path";

const file = path.resolve("public", "3 FRAME DASHBOARD + OG CARD.mp4");
getVideoMetadata(file)
  .then((meta) => {
    console.log("DURATION:", meta.durationInSeconds);
  })
  .catch((err) => {
    console.error(err);
  });
