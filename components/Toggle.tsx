import { Ref } from "preact";

interface ToggleProps {
  onClick: () => void;
  reference: Ref<HTMLInputElement>;
  checked: boolean;
  label: React.ReactNode;
}

export default function Toggle(props: ToggleProps) {
  return (
    <div className="form-control">
      <label className="label cursor-pointer">
        <input
          type="checkbox"
          className="toggle toggle-xs me-2"
          ref={props.reference}
          checked={props.checked}
          onClick={props.onClick}
        />
        <span
          className={`transition-colors label-text ${
            props.checked ? "text-slate-200" : "text-slate-500"
          }`}
        >
          {props.label}
        </span>
      </label>
    </div>
  );
}
