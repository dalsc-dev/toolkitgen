export function formatSrtTimestamp(seconds: number): string {
  const safe = Math.max(0, seconds);
  const hrs = Math.floor(safe / 3600);
  const mins = Math.floor((safe % 3600) / 60);
  const secs = Math.floor(safe % 60);
  const ms = Math.floor((safe % 1) * 1000);

  const pad = (n: number, w: number = 2) => String(n).padStart(w, '0');
  return `${pad(hrs)}:${pad(mins)}:${pad(secs)},${pad(ms, 3)}`;
}

export function formatVttTimestamp(seconds: number): string {
  return formatSrtTimestamp(seconds).replace(',', '.');
}

export function calculateSpeakingRate(wordCount: number, durationSeconds: number): { wpm: number; rating: 'Slow' | 'Conversational' | 'Rapid' } {
  if (durationSeconds <= 0 || wordCount <= 0) return { wpm: 0, rating: 'Slow' };
  const minutes = durationSeconds / 60;
  const wpm = Math.round(wordCount / minutes);
  if (wpm < 110) return { wpm, rating: 'Slow' };
  if (wpm <= 165) return { wpm, rating: 'Conversational' };
  return { wpm, rating: 'Rapid' };
}
