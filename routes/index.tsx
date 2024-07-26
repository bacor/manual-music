import ManiculeWrapper from "../islands/ManiculeWrapper.tsx";

export default function Mediapipe() {
  return (
    <div className="bg-slate-800 min-h-screen">
      <div className="mx-auto px-5 max-w-[640px]">
        <div className="pt-20 pb-10">
          {/* <div className="relative bg-red-500 block rotate-10 text-xs text-white">highly experimental</div> */}
          <h1 className="text-2xl mb-6 text-slate-200 font-bold">
            Manual Music
            <span class="bg-red-600 text-red-100 text-[0.4em] font-medium ms-3 px-2 py-0.5 rounded-full relative -top-1">EXPERIMENTAL v0.1</span>
            <span className="block font-normal text-slate-600">
              Guidonian Hand Readings with AI
            </span>
          </h1>
          <ol className="text-slate-400 list-decimal list-inside">
            <li>Allow access to your camera</li>
            <li>Make sure your hand is in view</li>
            <li>Solmize using the Guidonian hand...</li>
            <li className="text-slate-700">
              ...and see this very experimental model struggle
            </li>
          </ol>
        </div>

        <div className="-mx-5">
          <ManiculeWrapper />
        </div>

        <div className="pt-20 pb-10  text-slate-600 hover:text-slate-500 transition-colors">
          <h2 className="font-semibold">Nothing happens?</h2>
          <p class="mb-8">
            If the red dot at the top left of the video does not turn green when your hand moves in view, I'm afraid the app doesn't work in your browser. Try Chrome, Firefox or Safari on your computer: I've tested the app in those browsers on a MacBook.
          </p>
          
          <h2 className="font-semibold">Some background</h2>
          <p className="mb-4">
            For hundreds of years, musicians were trained to sight-read music
            using a solmization method that revolved around the{" "}
            <a
              href="https://en.wikipedia.org/wiki/Guidonian_hand"
              class="text-slate-400 hover:underline"
            >
              Guidonian hand
            </a>. Simplifying things a bit, the idea is that every joint of the
            hand corresponds to a note. Singers would touch the joint of the
            note they were singing with their thumb. In this way, they learned
            to associate notes with a physical gesture — a deeply embodied way
            of learning solmization. This is all quite similar to how
            instrumentalist associate notes with a position on their instrument.
            In fact, hands could even be used as instruments themselves: we know
            that choir masters could use the same gestures to indicate which
            notes the singers were supposed to sing.
          </p>
          <p className="mb-8">
            <em className="font-italic">Manual Music</em> is a random experiment by{" "}
            <a
              href="https://bascornelissen.nl"
              className="text-slate-400 hover:underline"
            >
              Bas Cornelissen
            </a>{" "}
            that tries to turn the hand into an instrument. As you can see, the
            experiment is in a very early stage. The project revolves around
            {" "}
            <a
              href="https://ai.google.dev/edge/mediapipe/solutions/vision/hand_landmarker"
              className="text-slate-400 hover:underline"
            >
              a model developed by Google
            </a>{" "}
            that detect hand position in images or video. Associating the joints
            with joints with pitches is straight forward — we are showing the
            Medieval names. The difficult part is to recognize to the different
            gestures. The approach currently taken is extremely naive: we look
            for the joint closest to the tip of the thumb. That works in some
            cases, but is not very reliable yet. Time permitting, the idea is to
            turn this app into an interface to collect annotated solmization
            gestures, and then train a gesture recognition model on that data.
          </p>

          

          <p class="text-xs">
            
            You can find all <a href="https://github.com/bacor/manual-music" class="text-slate-400">code on GitHub</a>.
            Built using <a href="https://ai.google.dev/edge/mediapipe/solutions/vision/hand_landmarker" class="text-slate-400">Mediapipe Solutions</a>,  <a href="https://fresh.deno.dev/" class="text-slate-400">Fresh</a>, <a href="https://deno.dev/" class="text-slate-400">Deno</a>, <a href="https://tailwindcss.com" class="text-slate-400">Tailwind</a>,  <a href="https://preactjs.com/" class="text-slate-400">Preact</a> and more.
            <br/> <br />
            Copyright © Bas Cornelissen, 2024.
          </p>
        </div>
      </div>
    </div>
  );
}
