import { ComponentChildren } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";
import {
  FilesetResolver,
  HandLandmarker,
  HandLandmarkerResult,
} from "@mediapipe/tasks-vision";

// Paths
const wasmFolderPath =
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm";
// To use a local model:
// const modelPath = asset("/models/hand_landmarker.task");
const modelPath =
  "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task";

async function initializeDetector(
  video: HTMLVideoElement,
  width: number = 640,
  height: number = 480,
): HandLandmarker | null {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { width, height },
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

export interface OnFrameProps {
  handsPresent: boolean;
  results: HandLandmarkerResult;
  canvas: HTMLCanvasElement;
  video: HTMLVideoElement;
}

export interface HandsDetectorProps {
  onFrame?: (props: OnFrameProps) => void;
  width?: number;
  height?: number;
  children?: ComponentChildren;
}

export default function HandsDetector({
  onFrame,
  width = 640,
  height = 480,
  children,
}: HandsDetectorProps = {}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  let detector: HandLandmarker | null = null;

  function renderLoop(): void {
    if (
      canvasRef.current && videoRef.current &&
      videoRef.current.readyState >= 2
    ) {
      const results = detector.detectForVideo(
        videoRef.current,
        performance.now(),
      );
      if (onFrame) {
        onFrame({
          handsPresent: results.handednesses.length > 0,
          results,
          canvas: canvasRef.current,
          video: videoRef.current,
        });
      }
    }
    requestAnimationFrame(renderLoop);
  }

  function cleanUp() {
    if (
      videoRef.current && videoRef.current.srcObject instanceof MediaStream
    ) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach((
        track,
      ) => track.stop());
    }
    if (detector) detector.close();
  }

  useEffect(() => {
    if (videoRef.current == null || canvasRef.current == null) return;

    initializeDetector(videoRef.current, width, height).then(
      (_detector: HandLandmarker) => {
        detector = _detector;
        setReady(true);
        renderLoop();
      },
    );
    return cleanUp;
  }, []);

  return (
    <>
      <div className={`relative w-[${width}px] h-[${height}px] bg-slate-600`}>
        <video
          class="w-full h-full"
          ref={videoRef}
          autoPlay
          playsInline
        />
        <canvas
          width={width}
          height={height}
          class="absolute object-fit top-0 left-0 w-full h-full rounded-t-lg"
          ref={canvasRef}
        />
        {ready
          ? children
          : (
            <div class="h-full w-full text-slate-400 flex flex-col justify-center">
              <p class="text-center">Loading...</p>
            </div>
          )}
      </div>
    </>
  );
}
