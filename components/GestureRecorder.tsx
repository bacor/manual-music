import { useEffect, useRef } from "preact/hooks";
import { signal } from "@preact/signals";
import { HandLandmarkerResult } from "@mediapipe/tasks-vision";
import HandsDetector, { OnFrameProps } from "./HandsDetector.tsx";
import VideoIndicator from "./VideoIndicator.tsx";

import { clearCanvas, drawHands } from "../src/drawing.tsx";
import SCRIPTS from "../src/scripts/index.tsx";
import { Script } from "../src/types.tsx";
import { slugify } from "../src/utils.tsx";

interface InstructionProps {
  message: string;
  title: string;
  duration?: number;
  showContinue?: boolean;
  onClick?: () => void;
}

function Instruction(
  { message, duration = 0, title, onClick, showContinue = false }:
    InstructionProps,
) {
  return (
    <div class="relative w-full text-white bg-slate-600 rounded-b-lg">
      <div class="px-5 py-3 z-10 relative">
        <h2 class="text-xs text-slate-400 mb-1">
          {title}
        </h2>
        <p>
          {message}
        </p>
        {showContinue && onClick && (
          <button
            class="px-2 py-1 bg-slate-800 rounded-md text-sm text-white mt-1"
            onClick={onClick}
          >
            Continue
          </button>
        )}
      </div>
      {duration > 0 && (
        <div
          class={`absolute top-0 bg-slate-200 left-0 z-0 h-1 w-full`}
          style={duration > 0 ? `animation: grow ${duration}s linear;` : ""}
        />
      )}
    </div>
  );
}

interface InstructionStepProps {
  script: string;
  step: number;
  setStep: (step: number) => void;
}

function InstructionStep({ script, step, setStep }: InstructionStepProps) {
  const steps = SCRIPTS[script].steps;
  const opts = steps[step];

  return (
    <Instruction
      duration={opts.duration}
      key={step}
      title={`Step ${step + 1} / ${steps.length}`}
      message={opts.instruction}
      showContinue={opts.duration == 0 && step < steps.length - 1}
      onClick={() => setStep(step + 1)}
    />
  );
}

const scriptName = signal("Demo");
const stepNum = signal(0);
const handsPresentSignal = signal(false);
const recStarted = signal(false);
const recFinished = signal(false);
const activeIndex = signal<number | null>(null);
const recordings = signal<Recording[]>([]);

interface RecordingEvent {
  time: number;
  step: number;
  handsPresent: boolean;
  results: HandLandMarkerResult;
}

interface Recording {
  script: Script;
  date: Date;
  start: number;
  end: number | null;
  events: RecordingEvent[];
  comments?: string;
}

function DownloadJSONLink({ recording }: { recording: Recording }) {
  const dataStr = `data:text/json;charset=utf-8,${
    encodeURIComponent(JSON.stringify(recording))
  }`;
  const name = slugify(recording.script.name);
  return (
    <a
      href={dataStr}
      download={`${name}.json`}
      class="text-sm bg-slate-400 rounded-md px-2 py-1 text-black"
    >
      Download
    </a>
  );
}

function Recordings({ recordings }: { recordings: Recording[] }) {
  return (
    <div class="bg-slate-700 text-white mt-2 rounded-lg p-5 w-full">
      <table class="w-full border-b border-slate-400">
        <thead class="text-slate-400 border-b border-slate-400">
          <tr>
            <td class="py-2">#</td>
            <td class="py-2">script</td>
            <td class="py-2">dur.</td>
            <td class="py-2">events</td>
            <td class="py-2 w-50">Comments</td>
            <td class="py-2"></td>
          </tr>
        </thead>
        {recordings.length > 0
          ? recordings.map((rec, idx) => (
            <tr>
              <td class="py-2 text-slate-400">{idx}</td>
              <td class="py-2">{rec.script.name}</td>
              <td class="py-2">{rec.end ? rec.end - rec.start : "..."}</td>
              <td class="py-2">{rec.end ? rec.events.length : "..."}</td>
              <td class="py-2">{rec.comments || "—"}</td>
              <td class="py-2">
                {rec.end ? <DownloadJSONLink recording={rec} /> : "..."}
              </td>
            </tr>
          ))
          : (
            <tr>
              <td colspan={6} class="text-center py-2">No recordings</td>
            </tr>
          )}
      </table>
    </div>
  );
}

function GestureRecorder() {
  const commentsRef = useRef<HTMLInputElement>(null);

  function onFrame({ handsPresent, results, canvas }: OnFrameProps) {
    handsPresentSignal.value = handsPresent;
    if (handsPresent) {
      const opts = {
        showFingers: true,
        showMarkers: false,
        showNames: false,
        showSpiral: false,
        findActiveGesture: false,
        markerSize: 1,
        activeIndex: activeIndex.value,
      };
      drawHands(results.landmarks, canvas, opts);
    } else {
      clearCanvas(canvas);
    }

    const step = SCRIPTS[scriptName.value].steps[stepNum.value];
    if (recStarted.value && !recFinished.value && step.record) {
      const lastRecording = recordings.value.at(-1);
      const lastEvent = lastRecording.events.at(-1);
      const now = performance.now();
      const fps = SCRIPTS[scriptName.value].fps;
      if (!lastEvent || now - lastEvent.time > 1000 / fps) {
        const event = {
          time: now,
          step: stepNum.value,
          handsPresent: handsPresent,
          results: {
            landmarks: results.landmarks,
            handedness: results.handedness,
          },
        };
        lastRecording.events.push(event);
      }
    }
  }

  function startRecording() {
    recordings.value.push({
      script: SCRIPTS[scriptName.value],
      date: new Date(),
      comments: commentsRef.current?.value,
      start: performance.now(),
      end: null,
      events: [],
    });
    stepNum.value = 0;
    recStarted.value = true;
    recFinished.value = false;
  }

  function endRecording() {
    recordings.value.at(-1).end = performance.now();
    recStarted.value = false;
    recFinished.value = true;
    reset();
  }

  function cancelRecording() {
    recordings.value.pop();
    reset();
  }

  function reset() {
    recStarted.value = false;
    activeIndex.value = null;
    stepNum.value = 0;
    if (commentsRef.current) commentsRef.current.value = "";
  }

  useEffect(() => {
    const steps = SCRIPTS[scriptName.value].steps;
    const duration = steps[stepNum.value].duration;
    if (recStarted && duration && duration > 0) {
      const timer = setTimeout(() => {
        if (stepNum.value < steps.length - 1) {
          activeIndex.value = steps[stepNum.value + 1].activeIndex || null;
          stepNum.value++;
        } else if (stepNum.value == steps.length - 1) {
          endRecording();
        }
      }, duration * 1000);
      return () => clearTimeout(timer);
    }
  });

  return (
    <div class="w-[640px] mx-auto">
      <div class="relative bg-slate-700 rounded-lg shadow-lg">
        <div class="overflow-hidden rounded-t-lg">
          <HandsDetector onFrame={onFrame}>
            <VideoIndicator on={handsPresentSignal} />
          </HandsDetector>
        </div>

        <div className="relative z-50 px-5 py-3">
          <form className="flex gap-3 text-sm">
            <select
              class="py-2 px-3 rounded-lg bg-slate-200"
              onChange={(e) => {
                scriptName.value = e.target.value;
              }}
            >
              <option disabled selected>
                Script
              </option>
              {Object.values(SCRIPTS).map((script) => (
                <option
                  value={script.name}
                  selected={script.name == scriptName.value}
                >
                  {script.name}
                </option>
              ))}
            </select>

            <input
              type="text"
              class="px-3 rounded-lg text-sm"
              disabled={recStarted.value}
              placeholder="Comments"
              ref={commentsRef}
            />

            <button
              type="button"
              class="text-white bg-red-600 font-medium rounded-lg px-3 py-2"
              disabled={recStarted.value && !recFinished.value}
              onClick={startRecording}
            >
              {!recStarted.value
                ? "Record"
                : recFinished.value
                ? "Record"
                : "Recording..."}
            </button>

            {recStarted.value && !recFinished.value
              ? (
                <button
                  type="button"
                  class="text-slate-300 bg-slate-600 font-medium rounded-lg px-3 py-2"
                  onClick={cancelRecording}
                >
                  Cancel
                </button>
              )
              : null}
          </form>
        </div>

        {recStarted.value && (
          <InstructionStep
            script={scriptName.value}
            step={stepNum.value}
            setStep={(step) => {
              stepNum.value = step;
            }}
          />
        )}
      </div>

      <Recordings recordings={recordings.value} />
    </div>
  );
}

export default GestureRecorder;
