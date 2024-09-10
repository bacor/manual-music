import { Landmark } from "./types.tsx";
import { distance } from "./utils.tsx";

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
