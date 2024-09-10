import gestures from "../gestures.tsx";
import { Script, Step } from "./types.tsx";

const steps: Step[] = [
  {
    duration: 1,
    instruction: "This is a demo script",
    record: false,
  },
  {
    duration: .5,
    instruction: "Go!",
    record: false,
  },
];

Object.values(gestures).filter((a) => a.id !== "none").slice(0, 3).forEach(
  (gesture) => {
    steps.push({
      duration: 1,
      instruction: `Please show ${gesture.name}`,
      activeIndex: gesture.index,
      record: true,
    } as Step);
  },
);

steps.push({
  duration: 2,
  instruction: "Thank you! That was it.",
  record: false,
} as Step);

const script: Script = {
  name: "Demo",
  fps: 3,
  steps,
};

export default script;
