export function listenMediaChange(
  mq: MediaQueryList,
  handler: (event: MediaQueryListEvent) => void,
) {
  if (typeof mq.addEventListener === "function") {
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }
  mq.addListener(handler);
  return () => mq.removeListener(handler);
}
