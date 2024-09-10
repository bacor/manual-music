import { Gesture } from "./types.tsx";

const gestures = [
  {
    id: "00-gamma-ut",
    order: 0,
    index: 4,
    joint: "thumb_tip",
    name: "Gamma ut",
    pitch: "G2",
  },
  {
    id: "01-are",
    order: 1,
    index: 3,
    joint: "thumb_ip",
    name: "A re",
    pitch: "A2",
  },
  {
    id: "02-bmi",
    order: 2,
    index: 2,
    joint: "thumb_mcp",
    name: "B mi",
    pitch: "Bb2"
  },
  {
    id: "03-cfaut",
    order: 3,
    index: 5,
    joint: "index_finger_mcp",
    name: "C fa ut",
    pitch: "C3"
  },
  {
    id: "04-dsolre",
    order: 4,
    index: 9,
    joint: "middle_finger_mcp",
    name: "D sol re",
    pitch: "D3"
  },
  {
    id: "05-elami",
    order: 5,
    index: 13,
    joint: "ring_finger_mcp",
    name: "E la mi",
    pitch: "E3"
  },
  {
    id: "06-ffaut",
    order: 6,
    index: 17,
    joint: "pinky_finger_mcp",
    name: "F fa ut",
    pitch: "F3"
  },
  {
    id: "07-gsolreut",
    order: 7,
    index: 18,
    joint: "pinky_finger_pip",
    name: "G sol re ut",
    pitch: "G3"
  },
  {
    id: "08-alamire",
    order: 8,
    index: 19,
    joint: "pinky_finger_dip",
    name: "A la mi re",
    pitch: "A3"
  },
  {
    id: "09-bmifa",
    order: 9,
    index: 20,
    joint: "pinky_finger_tip",
    name: "B mi fa",
    pitch: "Bb3"
  },
  {
    id: "10-csolfaut",
    order: 10,
    index: 16,
    joint: "ring_finger_tip",
    name: "C sol fa ut",
    pitch: "C4"
  },
  {
    id: "11-dlasolre",
    order: 11,
    index: 12,
    joint: "middle_finger_tip",
    name: "D la sol re",
    pitch: "D4"
  },
  {
    id: "12-elami",
    order: 12,
    index: 8,
    joint: "index_finger_tip",
    name: "E la mi",
    pitch: "E4"
  },
  {
    id: "13-ffaut",
    order: 13,
    index: 7,
    joint: "index_finger_dip",
    name: "F fa ut",
    pitch: "F4"
  },
  {
    id: "14-gsolreut",
    order: 14,
    index: 6,
    joint: "index_finger_pip",
    name: "G sol re ut",
    pitch: "G4"
  },
  {
    id: "15-alamire",
    order: 15,
    index: 10,
    joint: "middle_finger_pip",
    name: "A la mi re",
    pitch: "A4"
  },
  {
    id: "16-bmifa",
    order: 16,
    index: 14,
    joint: "ring_finger_pip",
    name: "B mi fa",
    pitch: "Bb4"
  },
  {
    id: "17-cesolla",
    order: 17,
    index: 15,
    joint: "ring_finger_dip",
    name: "C sol la",
    pitch: "C5"
  },
  {
    id: "18-delasol",
    order: 18,
    index: 11,
    joint: "middle_finger_dip",
    name: "D la sol",
    pitch: "D5"
  },
  {
    id: "19-ela",
    order: 19,
    index: null,
    joint: null,
    name: "E la",
    pitch: "E5"
  },
  {
    id: "none",
    order: null,
    index: null,
    joint: null,
    name: "No gesture",
    pitch: null
  },
];

export default gestures as Gesture[];