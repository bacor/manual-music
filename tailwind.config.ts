import { type Config } from "tailwindcss";
import dasisyui from "daisyui";

export default {
  content: [
    "{routes,islands,components}/**/*.{ts,tsx}",
  ],
  plugins: [
    dasisyui
  ],
  // theme: {
  //   extend: {
  //     keyframes: {
  //       grow: {
  //         '0%': { width: '0%' },
  //         '100%': { width: '100%' },
  //       }
  //     }
  //   }
  // }
} satisfies Config;
