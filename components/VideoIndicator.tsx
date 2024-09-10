import { Signal, signal } from "@preact/signals";

interface VideoIndicatorProps {
  on: Signal<boolean>;
  messageOn?: string;
  messageOff?: string;
}

export default function VideoIndicator(props: VideoIndicatorProps) {
  const on = props.on.value;
  const message = on ? props.messageOn : props.messageOff;
  return (
    <div>
      <div class="absolute left-5 top-4 flex">
        <div
          class={`relative me-3 mt-[.1em] rounded-full shandow-md transition-colors	 ${
            on ? "bg-green-500" : "bg-red-500"
          } w-3 h-3`}
        />
        {message && (
          <div class="text-white text-xs drop-shadow-md">{message}</div>
        )}
      </div>
    </div>
  );
}
