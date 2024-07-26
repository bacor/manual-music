import { type PageProps } from "$fresh/server.ts";
export default function App({ Component }: PageProps) {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Manual music: Guidonian Hand Readings with AI</title>
        <meta name="description" content="An experiment that tries to detect Guidonian solmization gestures in video using AI, hoping to turn the hand into an instrument." />
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body>
        <Component />
      </body>
    </html>
  );
}
