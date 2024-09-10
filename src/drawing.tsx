import { HandLandmarker } from "@mediapipe/tasks-vision";
import { Landmark } from "./types.tsx";
import "./curve.js";
import { distance } from "./utils.tsx";

export const historicalNoteNames = {
  4: "Gamma ut",
  3: "A re",
  2: "B mi",
  5: "C faut",
  9: "D solre",
  13: "E lami",
  17: "F faut",
  18: "G solreut",
  19: "A lamire",
  20: "B mifa",
  16: "C solfaut",
  12: "D lasolre",
  8: "E lami",
  7: "F faut",
  6: "G solreut",
  10: "A lamire",
  14: "B mifa",
  15: "C esolla",
  11: "D elasol",
};

export const spiral = [
  4, // "thumb_tip",
  3, // "thumb_ip",
  2, // "thumb_mcp",
  5, // "index_finger_mcp",
  9, // "middle_finger_mcp",
  13, // "ring_finger_mcp",
  17, // "pinky_finger_mcp",
  18, // "pinky_finger_pip",
  19, // "pinky_finger_dip",
  20, // "pinky_finger_tip",
  16, // "ring_finger_tip",
  12, // "middle_finger_tip",
  8, // "index_finger_tip",
  7, // "index_finger_dip",
  6, // "index_finger_pip",
  10, // "middle_finger_pip",
  14, // "ring_finger_pip",
  15, // "ring_finger_dip",
  11, // "middle_finger_dip"
];

export function drawSpiral(hand: Landmark[], canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // Solmization spiral
  const points = spiral.map(
    (index) => [hand[index].x * canvas.width, hand[index].y * canvas.height],
  ).flat();
  ctx.lineWidth = 1;
  ctx.strokeStyle = "rgba(0,0,0,0.5)";
  ctx.moveTo(points[0], points[1]);
  ctx.curve(points, .9);
  ctx.stroke();
}

export function drawFingers(
  hand: Landmark[],
  canvas: HTMLCanvasElement,
  width: number = 7,
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  HandLandmarker.HAND_CONNECTIONS.forEach(
    (connection: Record<"start" | "end", number>[]) => {
      const start = hand[connection.start];
      const end = hand[connection.end];
      ctx.beginPath();
      ctx.moveTo(start.x * canvas.width, start.y * canvas.height);
      ctx.lineTo(end.x * canvas.width, end.y * canvas.height);
      ctx.lineCap = "round";
      ctx.strokeStyle = "rgba(255, 255, 255, .1)";
      ctx.lineWidth = width;
      ctx.stroke();
    },
  );
}

export function drawMarkers(
  hand: Landmark[],
  canvas: HTMLCanvasElement,
  {
    markerSize = 3,
    showMarkers = true,
    showNames = true,
    showActive = true,
    activeIndex = null,
  } = {},
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const minZ = Math.min(...hand.map((landmark) => landmark.z));
  const maxZ = Math.max(...hand.map((landmark) => landmark.z));
  hand.forEach((landmark, index) => {
    const x = landmark.x * canvas.width;
    const y = landmark.y * canvas.height;
    const relZ = 1 - (landmark.z - minZ) / (maxZ - minZ);
    const size = markerSize * (.5 + relZ);

    if (showActive && activeIndex && activeIndex == index) {
      ctx.fillStyle = "rgba(255, 0, 0, .3)";
      ctx.beginPath();
      ctx.arc(x, y, 5 * size, 0, 2 * Math.PI);
      ctx.fill();
    }

    if (
      (showActive && activeIndex == index) ||
      (showMarkers && index in historicalNoteNames)
    ) {
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.arc(x, y, size, 0, 2 * Math.PI);
      ctx.fill();
    }

    if (
      (showActive && activeIndex == index) ||
      (showNames && index in historicalNoteNames)
    ) {
      ctx.font = "13px Arial";
      ctx.shadowColor = "rgba(0,0,0,0.8)";
      ctx.shadowBlur = 4;
      ctx.fillStyle = "white";

      // Center above point
      const noteName = historicalNoteNames[index];
      const size = ctx.measureText(noteName);
      const height = size.actualBoundingBoxAscent +
        size.actualBoundingBoxDescent;
      ctx.fillText(noteName, x - size.width / 2, y - height);
      ctx.shadowColor = "";
      ctx.shadowBlur = 0;
    }
  });
}

export function clearCanvas(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

export function drawHands(
  hands: Landmark[][],
  canvas: HTMLCanvasElement,
  {
    activeIndex = null,
    findActiveGesture = true,
    showSpiral = true,
    showFingers = true,
    showMarkers = true,
    showNames = true,
    markerSize = 3,
  } = {},
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  clearCanvas(canvas);

  hands.forEach((hand) => {
    // Find joint closest to thumb tip
    const thumb = hand[4];
    let closestDist = 1000;
    let closestIdx = null;
    if (findActiveGesture) {
      hand.forEach((landmark, index) => {
        const dist = distance(thumb, landmark);
        if (index > 4 && dist < closestDist) {
          closestDist = dist;
          closestIdx = index;
        }
      });
      activeIndex = closestDist < 0.1 ? closestIdx : null;
    }

    if (showSpiral) drawSpiral(hand, canvas);
    if (showFingers) drawFingers(hand, canvas);

    drawMarkers(hand, canvas, {
      showNames,
      showMarkers,
      markerSize,
      activeIndex,
    });
  });
}
