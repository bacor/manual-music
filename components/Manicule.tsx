import { useEffect, useRef, useState } from "preact/hooks";
import { FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";
import "../utils/curve.js";
import mobile  from "is-mobile";

// Paths
const wasmFolderPath =
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm";
// To use a local model:
// const modelPath = asset("/models/hand_landmarker.task");
const modelPath =
  "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task";

interface VideoIndicatorProps {
  on: boolean;
  message: string;
}

function VideoIndicator(props: VideoIndicatorProps) {
  return (
    <div>
      <div class="absolute left-5 top-4 flex">
        <div
          class={`relative me-3 mt-[.1em] rounded-full shandow-md transition-colors	 ${
            props.on ? "bg-green-500" : "bg-red-500"
          } w-3 h-3`}
        />
        <div class="text-white text-xs drop-shadow-md">{props.message}</div>
      </div>
    </div>
  );
}

interface ToggleProps {
  onClick: () => void;
  reference: React.MutableRefObject<HTMLInputElement>;
  checked: boolean;
  label: React.ReactNode;
}

function Toggle(props: ToggleProps) {
  return (
    <div className="form-control">
      <label className="label cursor-pointer">
        <input
          type="checkbox"
          className="toggle toggle-xs me-2"
          ref={props.reference}
          checked={props.checked}
          onClick={props.onClick}
        />
        <span
          className={`transition-colors label-text ${
            props.checked ? "text-slate-200" : "text-slate-500"
          }`}
        >
          {props.label}
        </span>
      </label>
    </div>
  );
}

interface Landmark {
  x: number;
  y: number;
  z: number;
}

let historicalNoteNames = {
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

let spiral = [
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

function drawSpiral(hand: Landmark[], canvas: HTMLCanvasElement) {
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

function drawFingers(
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

function drawMarkers(
  hand: Landmark[],
  canvas: HTMLCanvasElement,
  {
    markerSize = 3,
    showMarkers = true,
    showNames = true,
    showActive = true,
    mirror = true,
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
    let size = markerSize * (.5 + relZ);

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

      // const padX = 3;
      // const padY = 3;
      // ctx.roundRect(
      //   x - .5 * size.width - padX,
      //   y - 2 * height - padY,
      //   size.width + 2 * padX,
      //   height + 2 * padY,
      //   [5]
      // );
      // ctx.fillStyle = "rgba(255, 255, 255, .5";
      // ctx.fill();
      ctx.shadowColor = "";
      ctx.shadowBlur = 0;
    }
  });
}

function distance(a: Landmark, b: Landmark): number {
  return Math.sqrt(
    (a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2,
  );
}

function drawHands(
  hands: Landmark[][],
  canvas: HTMLCanvasElement,
  {
    showSpiral = true,
    showFingers = true,
    showMarkers = true,
    showNames = true,
    mirror = true,
  } = {},
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  hands.forEach((hand) => {
    // Find joint closest to thumb tip
    const thumb = hand[4];
    let closestDist = 1000;
    let closestIdx = null;
    hand.forEach((landmark, index) => {
      const dist = distance(thumb, landmark);
      if (index > 4 && dist < closestDist) {
        closestDist = dist;
        closestIdx = index;
      }
    });

    if (showSpiral) drawSpiral(hand, canvas);
    if (showFingers) drawFingers(hand, canvas);

    drawMarkers(hand, canvas, {
      showNames,
      showMarkers,
      mirror,
      activeIndex: closestDist < 0.1 ? closestIdx : null,
    });
  });
}

async function initializeDetector(
  video: HTMLVideoElement,
): HandLandmarker | null {
  // Setup Video
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { width: 640, height: 480 },
    });
    video.srcObject = stream;
  } catch (error) {
    console.error("Error accessing webcam:", error);
    return;
  }

  // Setup Detector
  try {
    const vision = await FilesetResolver.forVisionTasks(
      wasmFolderPath,
    );

    const detector = await HandLandmarker.createFromOptions(
      vision,
      {
        baseOptions: {
          modelAssetPath: modelPath,
          delegate: "GPU",
        },
        numHands: 1,
        runningMode: "video",
      },
    );
    return detector;
  } catch (error) {
    console.error("Error initializing hand detection:", error);
    return;
  }
}

function detect(
  detector: HandLandmarker,
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement,
  opts = {},
) {
  let results = null;
  if (video && video.readyState >= 2) {
    results = detector.detectForVideo(
      video,
      performance.now(),
    );
    const hands = results.landmarks;
    if (hands) drawHands(hands, canvas, opts);
  }
  return results;
}

const Manicule = () => {

  if(mobile({tablet: true})) {
    return (
      <div className="relative bg-slate-700 rounded-lg shadow-lg mx-auto">
        <div className="p-5 text-white">
          <p>
            Oh no! this experiment is not available on mobile devices — yet. Please have a look on your computer, and check back later. Thanks!
          </p>
        </div>
      </div>
    )
  }


  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mirrorToggleRef = useRef<HTMLInputElement>(null);
  const spiralToggleRef = useRef<HTMLInputElement>(null);
  // const fingersToggleRef = useRef<HTMLInputElement>(null);
  const markersToggleRef = useRef<HTMLInputElement>(null);
  const namesToggleRef = useRef<HTMLInputElement>(null);

  const [mirror, setMirror] = useState(false);
  const [handPresence, setHandPresence] = useState(null);
  const [showSpiral, setShowSpiral] = useState(true);
  // const [showFingers, setShowFingers] = useState(true);
  const [showMarkers, setShowMarkers] = useState(false);
  const [showNames, setShowNames] = useState(false);

  useEffect(async () => {
    // TODO: an async effect is apparently not allowed.
    // But using an async setup function inside the effect, it doensn't work in Safari & Firefox...?

    // Check that the refs exist.
    const refs = [videoRef, canvasRef, markersToggleRef, spiralToggleRef]
    if(refs.some((ref) => ref.current === null)) return;

    // Initialize hand detection and video
    // let detector: HandLandmarker | null;
    // const setup = async () => {
    //   detector = await initializeDetector(videoRef.current);
    // };
    // setup();
    const detector = await initializeDetector(videoRef.current);

    // Run the detection loop
    const run = () => {
      // A bit of a hack: don't let useEffects depend on the state, so the
      // app doesnt' reload when the user toggles the spiral.
      const opts = {
        showFingers: true,
        showMarkers: markersToggleRef.current.checked,
        showSpiral: spiralToggleRef.current.checked,
        showNames: namesToggleRef.current.checked,
        mirror: namesToggleRef.current.checked,
      };
      const results = detect(
        detector,
        videoRef.current,
        canvasRef.current,
        opts,
      );
      if (results) setHandPresence(results.handednesses.length > 0);
      requestAnimationFrame(run);
    };
    run();

    // Cleanup function
    const cleanUp = () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
      if (detector) detector.close();
    };
    return cleanUp;
  }, []);

  return (
    <>
      <div className="relative bg-slate-700 rounded-lg shadow-lg w-[640px] mx-auto">
        <div className="relative w-[640px] h-[480px]">
          <VideoIndicator
            on={handPresence}
            message={handPresence ? "Hand in view!" : "Please move your hand in view"}
          />
          <video
            class={`rounded-t-lg w-full h-full ${mirror ? "-scale-x-100" : ""}`}
            ref={videoRef}
            autoPlay
            playsInline
          >
          </video>
          <canvas
            width={640}
            height={480}
            class={`absolute object-fit top-0 left-0 w-full h-full rounded-t-lg ${
              mirror ? "-scale-x-100" : ""
            }`}
            ref={canvasRef}
          >
          </canvas>
        </div>

        <div className="relative z-50 rounded-b-lg px-5 py-3 text-white">
          <form className="flex justify-between">
            {
              /* <Toggle
              reference={fingersToggleRef}
              checked={showFingers}
              onClick={() => setShowFingers(!showFingers)}
              label="Fingers" /> */
            }

            <Toggle
              reference={spiralToggleRef}
              checked={showSpiral}
              onClick={() => setShowSpiral(!showSpiral)}
              label="Spiral"
            />

            <Toggle
              reference={markersToggleRef}
              checked={showMarkers}
              onClick={() => setShowMarkers(!showMarkers)}
              label="Markers"
            />

            <Toggle
              reference={namesToggleRef}
              checked={showNames}
              onClick={() => setShowNames(!showNames)}
              label="Names"
            />

            <Toggle
              reference={mirrorToggleRef}
              checked={mirror}
              onClick={() => setMirror(!mirror)}
              label="Mirror"
            />
          </form>
        </div>
      </div>
    </>
  );
};

export default Manicule;

// Notes
// https://blog.tensorflow.org/2021/11/3D-handpose.html
// https://stackoverflow.com/questions/76222648/how-to-use-a-web-worker-with-mediapipe-vision
// https://medium.com/@darren_45987/react-lazy-making-lazy-less-lazy-8ce1a1986622
// https://medium.com/@kiyo07/integrating-mediapipe-tasks-vision-for-hand-landmark-detection-in-react-a2cfb9d543c7
// https://ai.google.dev/edge/mediapipe/solutions/vision/hand_landmarker/web_js#video
// ====> https://codepen.io/mediapipe-preview/pen/gOKBGPN
