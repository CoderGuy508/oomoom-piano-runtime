# OOMOOM Piano transcription runtime

Readable browser worker dependency for OOMOOM Piano Player. It bundles Spotify Basic Pitch 1.0.1 and TensorFlow.js for local audio-to-note conversion. The userscript pins a Git commit and SHA-256 integrity hash; this repository does not contain credentials or user recordings.

The worker is defined but not executed when loaded. The piano userscript runs it in a dedicated worker when importing audio. Recognition runs locally. The Basic Pitch model is fetched from the version-pinned official package on unpkg.com.

Third-party source and license notices are included in THIRD_PARTY_NOTICES.txt and the readable bundle. Basic Pitch/TensorFlow.js use Apache-2.0.
