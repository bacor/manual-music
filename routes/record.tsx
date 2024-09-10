import ComponentWrapper from "../islands/ComponentWrapper.tsx";

export default function RecordPage() {
  return (
    <div className="bg-slate-800 min-h-screen">
      <div className="mx-auto px-5 max-w-[640px]">

        <div className="pt-20">
          <ComponentWrapper component="recorder" />
        </div>

      </div>
    </div>
  );
}
