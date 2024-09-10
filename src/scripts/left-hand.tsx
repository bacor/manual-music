import gestures from "../gestures.tsx";
import { Script, Step } from "../types.tsx";

const steps: Step[] = [
  {
    duration: 0,
    instruction:
      "You are asked to show all gestures from Gamma ut to E la for 5 seconds each.",
    record: false,
  },
  {
    duration: 0,
    instruction:
      "Change to the next gesture exactly when the progress bar is complete",
    record: false,
  },
  {
    duration: 0,
    instruction:
      "Slowly rotate your hand to show each gesture from multiple angles.",
    record: false,
  },
  {
    duration: 0,
    instruction:
      "Ready? Hold your LEFT hand in front of the camera without showing a gesture.",
    record: false,
  },
  {
    duration: 3,
    instruction:
      "Get ready to show Gamma ut (when the progress bar is complete)",
    record: false,
  },
];

Object.values(gestures).filter((a) => a.id !== "none").forEach((gesture) => {
  steps.push({
    duration: 5,
    activeIndex: gesture.index,
    instruction: `Please show ${gesture.name}`,
    record: true,
  } as Step);
  steps.push({
    duration: 2,
    instruction: "Open your hand",
    record: true,
  });
});

steps.push({
  duration: 2,
  instruction: "Thank you! That was it.",
  record: false,
} as Step);

const script: Script = {
  name: "Complete left hand",
  fps: 5,
  steps,
};

export default script;
