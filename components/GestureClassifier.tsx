import { useEffect, useRef } from "preact/hooks";
import { Signal, signal } from "@preact/signals";
import HandsDetector, { OnFrameProps } from "./HandsDetector.tsx";
import VideoIndicator from "./VideoIndicator.tsx";

import { clearCanvas, drawHands } from "../src/drawing.tsx";
import { thumbDistanceClassifier } from "../src/classifiers.tsx";
import { Landmark } from "../src/types.tsx";
import gestures from "../src/gestures.tsx";
import * as Tone from "tone";

const gestureToPitch: Record<string, string | null> = {};
gestures.forEach((gesture) => {
  gestureToPitch[gesture.id] = gesture.pitch;
});

const handsPresentSignal = signal(false);
const gesture = signal<null | string>(null);

const DRAWING_OPTS = {
  showFingers: true,
  showMarkers: false,
  showNames: false,
  showSpiral: false,
  findActiveGesture: false,
};

function Prediction({ gesture }: { gesture: Signal<string | null> }) {
  return (
    <p class="text-center text-white">
      {gesture.value
        ? gesture.value
        : <span class="opacity-50">No gesture detected</span>}
    </p>
  );
}

const clf = (landmarks: Landmark[]) => thumbDistanceClassifier(landmarks, 0.1);

function GestureClassifier({ classifier = clf }) {
  const useBNatural = true;
  const synth = useRef<Tone.PolySynth<Tone.Synth<Tone.SynthOptions>> | null>(
    null,
  );

  function onFrame({ handsPresent, results, canvas }: OnFrameProps) {
    handsPresentSignal.value = handsPresent;
    if (handsPresent) {
      drawHands(results.landmarks, canvas, DRAWING_OPTS);
      const pred = classifier(results.landmarks[0]);
      if (pred !== null) {
        if (pred !== gesture.value) {
          synth.current?.releaseAll();
          let pitch = gestureToPitch[pred];
          if (pitch?.startsWith("B") && useBNatural) {
            pitch = pitch.replace("Bb", "B");
          }
          synth.current?.triggerAttack(pitch);
        }
      } else {
        synth.current?.releaseAll();
      }
      gesture.value = pred;
    } else {
      clearCanvas(canvas);
      synth.current?.releaseAll();
      gesture.value = null;
    }
  }

  useEffect(() => {
    synth.current = new Tone.PolySynth().toDestination();
    synth.current.set({
      envelope: {
        attack: 2,
        decay: 4,
        release: 3,
      },
    });
  }, []);

  const handleClick = async () => {
    await Tone.start();
    const now = Tone.now() + .2;
    synth.current.triggerAttackRelease("C4", .2, now);
    synth.current.triggerAttackRelease("E4", .1, now + 0.2);
    synth.current.triggerAttackRelease("G4", .1, now + 0.3);
    synth.current.triggerAttackRelease("Bb4", .2, now + 0.4);
  };

  return (
    <div class="w-[640px] mx-auto">
      <div class="relative bg-slate-700 rounded-lg shadow-lg">
        <div class="overflow-hidden rounded-t-lg">
          <HandsDetector onFrame={onFrame}>
            <VideoIndicator on={handsPresentSignal} />
          </HandsDetector>
        </div>

        <div className="relative z-50 px-5 py-3">
          <Prediction gesture={gesture} />
          <button
            onClick={handleClick}
            class="px-3 py-1 bg-slate-400 text-white"
          >
            start
          </button>
        </div>
      </div>
    </div>
  );
}

export default GestureClassifier;
