import { useEffect, useRef, useState } from "preact/hooks";
import { signal } from "@preact/signals";

import HandsDetector, { OnFrameProps } from "./HandsDetector.tsx";
import Toggle from "./Toggle.tsx";
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

const classifier = (landmarks: Landmark[]) =>
  thumbDistanceClassifier(landmarks, 0.1);

const handsPresentSignal = signal(false);
const gesture = signal<null | string>(null);
const playAudio = signal<boolean>(true);
const BNatural = signal<boolean>(false);

const HandsVisualizer = () => {
  const spiralToggleRef = useRef<HTMLInputElement>(null);
  const markersToggleRef = useRef<HTMLInputElement>(null);
  const namesToggleRef = useRef<HTMLInputElement>(null);

  const [showSpiral, setShowSpiral] = useState(true);
  const [showMarkers, setShowMarkers] = useState(false);
  const [showNames, setShowNames] = useState(false);

  const synth = useRef<Tone.PolySynth<Tone.Synth<Tone.SynthOptions>> | null>(
    null,
  );

  function onFrame({ handsPresent, results, canvas }: OnFrameProps) {
    handsPresentSignal.value = handsPresent;
    if (handsPresent) {
      const displayOpts = {
        showFingers: true,
        showMarkers: markersToggleRef.current?.checked,
        showSpiral: spiralToggleRef.current?.checked,
        showNames: namesToggleRef.current?.checked,
      };
      drawHands(results.landmarks, canvas, displayOpts);
      const pred = classifier(results.landmarks[0]);
      if (pred !== null && playAudio.value) {
        if (pred !== gesture.value) {
          synth.current?.releaseAll();
          let pitch = gestureToPitch[pred];
          if (pitch?.startsWith("B") && BNatural.value) {
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

  return (
    <div className="relative bg-slate-700 rounded-lg shadow-lg mx-auto">
      <div class="rounded-t-lg overflow-hidden">
        <HandsDetector onFrame={onFrame}>
          <VideoIndicator
            on={handsPresentSignal}
            messageOn="Hand detected!"
            messageOff="Please move your hand in view"
          />
        </HandsDetector>
      </div>
      <div className="relative z-50 rounded-b-lg px-5 py-3 text-white">
        <form className="flex justify-between">
          <Toggle
            reference={null}
            checked={playAudio.value}
            onClick={() => playAudio.value = !playAudio.value}
            label="Audio"
          />

          <Toggle
            reference={null}
            checked={BNatural.value}
            onClick={() => BNatural.value = !BNatural.value}
            label="B Natural"
          />

          <Toggle
            reference={spiralToggleRef}
            checked={showSpiral}
            onClick={() => setShowSpiral((prev) => !prev)}
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
        </form>
      </div>
    </div>
  );
};

export default HandsVisualizer;
