export function float32ToInt16(float32Array: Float32Array): Int16Array {
  const int16 = new Int16Array(float32Array.length);
  for (let i = 0; i < float32Array.length; i++) {
    int16[i] = Math.max(-1, Math.min(1, float32Array[i])) * 0x7fff;
  }
  return int16;
}
