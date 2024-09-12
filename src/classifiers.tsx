import { Landmark } from "./types.tsx";
import { distance } from "./utils.tsx";
import * as tf from "@tensorflow/tfjs";
import gestures from "./gestures.tsx";
import Deno from "@deno";
// const MODEL_URL = path.fromFileUrl('./model/model.json');
// const p3 = path.fromFileUrl("file:///home/foo");
import SelFeatsModel5 from "../static/model-5/selected-features.json" with {
  type: "json",
};

const selectedFeaturesByModel: Record<string, number[][]> = {
  "model-5": SelFeatsModel5,
};

const landmarkToGesture = {
  4: "00-gamma-ut",
  3: "01-are",
  2: "02-bmi",
  5: "03-cfaut",
  9: "04-dsolre",
  13: "05-elami",
  17: "06-ffaut",
  18: "07-gsolreut",
  19: "08-alamire",
  20: "09-bmifa",
  16: "10-csolfaut",
  12: "11-dlasolre",
  8: "12-elami",
  7: "13-ffaut",
  6: "14-gsolreut",
  10: "15-alamire",
  14: "16-bmifa",
  15: "17-cesolla",
  11: "18-delasol",
};

export function thumbDistanceClassifier(
  landmarks: Landmark[],
  tol: number = 0.1,
): string | null {
  const thumb = landmarks[4];
  let closestDist = 10000;
  let closestIdx = null;
  landmarks.forEach((landmark, index) => {
    const dist = distance(thumb, landmark);
    if (index > 4 && dist < closestDist) {
      closestDist = dist;
      closestIdx = index;
    }
  });
  if (closestIdx && closestDist < tol) {
    return landmarkToGesture[closestIdx] ?? null;
  }
  return null;
}

const selected_distances = [
  [1, 8],
  [1, 12],
  [2, 8],
  [2, 12],
  [3, 8],
  [3, 9],
  [3, 12],
  [3, 13],
  [3, 17],
  [4, 6],
  [4, 7],
  [4, 8],
  [4, 9],
  [4, 10],
  [4, 11],
  [4, 12],
  [4, 13],
  [4, 14],
  [4, 15],
  [4, 16],
  [4, 17],
  [4, 18],
  [4, 19],
  [4, 20],
  [5, 12],
  [8, 12],
  [11, 16],
  [12, 16],
];

interface loadModelOutput {
  model: tf.LayersModel;
  selectedFeatures: number[][];
}

export async function loadModel(name: string): loadModelOutput {
  const model = await tf.loadLayersModel(`/${name}/model.json`);
  // TODO load JSON
  // const jsonStr = await Deno.readTextFile(`/${name}/selected-features.json`)
  // const selectedFeatures = JSON.parse(jsonStr)
  const selectedFeatures = selectedFeaturesByModel[name];
  return { model, selectedFeatures };
}

export function MLPClassifier(
  model: tf.LayersModel,
  selectedFeatures: number[][],
  landmarks: Landmark[],
): string | null {
  const dists = selectedFeatures.map(([i, j]) =>
    distance(landmarks[i], landmarks[j])
  );
  const input = tf.tensor([dists]);
  const output = model.predict(input);
  const pred = tf.argMax(output, 1);
  const gesture_idx = pred.dataSync()[0];
  return gestures[gesture_idx]["id"];
}
