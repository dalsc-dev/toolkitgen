export const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export function frequencyToNote(frequencyHz: number): {
  note: string;
  octave: number;
  centsOff: number;
} | null {
  if (frequencyHz <= 20 || frequencyHz >= 20000) return null;

  // MIDI note formula: n = 12 * log2(f / 440) + 69
  const midi = 12 * (Math.log(frequencyHz / 440) / Math.log(2)) + 69;
  const roundedMidi = Math.round(midi);
  const centsOff = Math.round((midi - roundedMidi) * 100);

  const noteIndex = ((roundedMidi % 12) + 12) % 12;
  const octave = Math.floor(roundedMidi / 12) - 1;

  return {
    note: NOTE_NAMES[noteIndex],
    octave,
    centsOff,
  };
}
