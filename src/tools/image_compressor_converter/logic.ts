export function calculateScaledDimensions(
  width: number,
  height: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number; scaled: boolean } {
  if (width <= 0 || height <= 0) return { width: 0, height: 0, scaled: false };
  if (maxWidth <= 0 && maxHeight <= 0) return { width, height, scaled: false };

  const targetMaxW = maxWidth > 0 ? maxWidth : width;
  const targetMaxH = maxHeight > 0 ? maxHeight : height;

  if (width <= targetMaxW && height <= targetMaxH) {
    return { width, height, scaled: false };
  }

  const ratioW = targetMaxW / width;
  const ratioH = targetMaxH / height;
  const ratio = Math.min(ratioW, ratioH);

  return {
    width: Math.round(width * ratio),
    height: Math.round(height * ratio),
    scaled: true
  };
}

export function formatByteSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
