# Manual Music

**Manual Music is an experiment that tries to turn the hand into an
instrument.**

## Guidonian Hand

For hundreds of years, musicians were trained to sight-read music using a
solmization method that revolved around the
[Guidonian hand](https://en.wikipedia.org/wiki/Guidonian_hand). Simplifying
things a bit, the idea is that every joint of the hand corresponds to a note.
Singers would touch the joint of the note they were singing with their thumb. In
this way, they learned to associate notes with a physical gesture — a deeply
embodied way of learning solmization. This is all quite similar to how
instrumentalist associate notes with a position on their instrument. In fact,
hands could even be used as instruments themselves: we know that choir masters
could use the same gestures to indicate which notes the singers were supposed to
sing.

## Status

The experiment is in a very early stage. The project revolves around
[a model developed by Google](https://ai.google.dev/edge/mediapipe/solutions/vision/hand_landmarker)
that detect hand position in images or video. Associating the joints with joints
with pitches is straight forward — we are showing the Medieval names. The
difficult part is to recognize to the different gestures. The approach currently
taken is extremely naive: we look for the joint closest to the tip of the thumb.
That works in some cases, but is not very reliable yet. Time permitting, the
idea is to turn this app into an interface to collect annotated solmization
gestures, and then train a gesture recognition model on that data.

## Usage

Make sure to
[install Deno](https://deno.land/manual/getting_started/installation). Then
start the project:

```sh
deno task start
```

This will watch the project directory and restart as necessary.

## License

I haven't decided yet.
