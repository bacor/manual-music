import { type Config } from "tailwindcss";
import dasisyui from "daisyui";

export default {
  content: [
    "{routes,islands,components}/**/*.{ts,tsx}",
  ],
  plugins: [
    dasisyui,
  ],
} satisfies Config;
