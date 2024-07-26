// Node is not yet supported, so this is essentially a hack to ensure 
// it only loads in the browser!
// https://stackoverflow.com/questions/77362983/dynamic-component-on-deno-fresh-island-referenceerror-document-is-not-defined
import { IS_BROWSER } from "$fresh/runtime.ts";
import { lazy, Suspense } from "preact/compat";

const Manicule = lazy(() => import("../components/Manicule.tsx"));

export default function ManiculeWrapper() {
  if (!IS_BROWSER) return <div></div>;

  return (
    <div>
      <Suspense fallback={<p>Loading...</p>}>
        <Manicule />
      </Suspense>
    </div>
  );
}
