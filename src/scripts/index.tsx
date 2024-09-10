import { Script } from "../types.tsx";
import leftHand from "./left-hand.tsx";
import singleGestures from "./single-gestures.tsx";

import demo from "./demo.tsx";

const scripts: Record<string, Script> = {}

const allScripts: Script[] = [demo, leftHand, ...singleGestures];
allScripts.forEach((obj: Script) => {
  scripts[obj.name] = obj;
})

export default scripts;