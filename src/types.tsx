export interface Step {
  instruction: string;
  duration?: number;
  activeIndex?: number;
  record?: boolean;
}

export interface Script {
  name: string;
  fps: number;
  steps: Step[];
}

export interface Gesture {
  id: string;
  name: string;
  order: number | null;
  index: number | null;
  joint: string | null;
  pitch: string | null;
}

export interface Landmark {
  x: number;
  y: number;
  z: number;
}