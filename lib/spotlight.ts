const inks = new Set<HTMLElement>();

export function registerSecretInk(el: HTMLElement) {
  inks.add(el);
  return () => {
    inks.delete(el);
  };
}

export function writeSpotlight(x: number, y: number, radius: number) {
  const xs = `${x}px`;
  const ys = `${y}px`;
  const rs = `${Math.max(0, radius)}px`;
  for (const el of inks) {
    el.style.setProperty("--spot-x", xs);
    el.style.setProperty("--spot-y", ys);
    el.style.setProperty("--spot-r", rs);
  }
}

export function clearSpotlight() {
  writeSpotlight(0, 0, 0);
}
