import gestures from "../gestures.tsx";
import { Gesture, Script, Step } from "../types.tsx";

function getRepeatedGestureScript(
  gesture: Gesture,
  repetitions: number = 10,
  fps: number = 5,
): Script {
  const steps: Step[] = [
    {
      duration: 3,
      instruction:
        "You are asked to repeatedly show a single gesture with your LEFT hand.",
      record: false,
    },
    {
      duration: 3,
      instruction:
        "Please keep moving your hand while making sure it remains in view.",
      record: false,
    },
  ];
  for (let i = 0; i < repetitions; i++) {
    steps.push({
      duration: 5,
      instruction: `Please show ${gesture.name} (${gesture.id}).`,
      activeIndex: gesture.index,
      record: true,
    } as Step);
    steps.push({
      duration: 2,
      instruction: "Open your hand",
      record: true,
    } as Step);
  }
  steps.push({
    duration: 2,
    instruction: "Thank you! That was it.",
    record: false,
  } as Step);

  const script: Script = {
    steps,
    fps: fps,
    name: `${gesture.id}`,
  };
  return script;
}

const scripts: Script[] = gestures.map((gesture) =>
  getRepeatedGestureScript(gesture)
);

export default scripts;
