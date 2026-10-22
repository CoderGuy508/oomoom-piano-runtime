import * as tf from '@tensorflow/tfjs';
import {
  BasicPitch,
  outputToNotesPoly,
  noteFramesToTime,
} from '@spotify/basic-pitch';

let enginePromise;
const loadEngine = () =>
  enginePromise ||
  (enginePromise = (async () => {
    await tf.setBackend('cpu');
    await tf.ready();
    self.postMessage({
      progress: 0,
      stage: 'Downloading transcription model…',
    });
    const engine = new BasicPitch(
      'https://unpkg.com/@spotify/basic-pitch@1.0.1/model/model.json',
    );
    await engine.model;
    return engine;
  })());

self.onmessage = async ({ data }) => {
  try {
    const engine = await loadEngine();
    const frames = [],
      onsets = [];
    await engine.evaluateModel(
      data.samples,
      (f, o) => {
        frames.push(...f);
        onsets.push(...o);
      },
      (progress) => self.postMessage({ progress, stage: 'Finding notes…' }),
    );
    const dense = data.style === 'mix';
    const notes = noteFramesToTime(
      outputToNotesPoly(
        frames,
        onsets,
        dense ? 0.6 : 0.4,
        dense ? 0.4 : 0.3,
        8,
      ),
    );
    self.postMessage({ notes });
  } catch (error) {
    self.postMessage({ error: `Audio conversion failed: ${error.message}` });
  }
};
