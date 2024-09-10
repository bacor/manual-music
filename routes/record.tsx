import ComponentWrapper from "../islands/ComponentWrapper.tsx";

export default function RecordPage() {
  return (
    <div class="bg-slate-800 min-h-screen">
      <div class="mx-auto px-5 max-w-[640px]">
        <div class="pt-20">
          <ComponentWrapper component="recorder" />
        </div>
      </div>
    </div>
  );
}
