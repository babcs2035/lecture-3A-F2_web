export function calcPower(amp: number) {
  const c1 = 1601.574146;
  const c2 = 1.286222476;
  const p = 100 * Math.pow(amp / c1, c2);
  return p.toFixed(3);
}
