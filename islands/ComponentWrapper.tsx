// Node is not yet supported, so this is essentially a hack to ensure
// it only loads in the browser!
// https://stackoverflow.com/questions/77362983/dynamic-component-on-deno-fresh-island-referenceerror-document-is-not-defined
import { IS_BROWSER } from "$fresh/runtime.ts";
import { lazy, Suspense } from "preact/compat";
import mobile from "is-mobile";
import { ComponentChildren } from "preact";

const HandsVisualizer = lazy(() => import("../components/HandsVisualizer.tsx"));
const GestureRecorder = lazy(() => import("../components/GestureRecorder.tsx"));
const GestureClassifier = lazy(() =>
  import("../components/GestureClassifier.tsx")
);

const Fallback = ({ children }: { children: ComponentChildren }) => (
  <div className="relative bg-slate-700 rounded-lg shadow-lg w-[640px] mx-auto">
    <div className="p-5 text-white">
      {children}
    </div>
  </div>
);

export default function ManiculeWrapper({ component = "visualizer" } = {}) {
  if (!IS_BROWSER) {
    return <div></div>;
  } else if (mobile({ tablet: true })) {
    return (
      <Fallback>
        <p>
          Oh no! this experiment is not available on mobile devices — yet.
          Please have a look on your computer, and check back later. Thanks!
        </p>
      </Fallback>
    );
  } else if (component === "visualizer") {
    return (
      <div>
        <Suspense fallback={<Fallback>Loading...</Fallback>}>
          <HandsVisualizer />
        </Suspense>
      </div>
    );
  } else if (component === "recorder") {
    return (
      <div>
        <Suspense fallback={<Fallback>Loading...</Fallback>}>
          <GestureRecorder />
        </Suspense>
      </div>
    );
  } else if (component === "classifier") {
    return (
      <div>
        <Suspense fallback={<Fallback>Loading...</Fallback>}>
          <GestureClassifier />
        </Suspense>
      </div>
    );
  } else {
    return <Fallback>Unknown component</Fallback>;
  }
}
