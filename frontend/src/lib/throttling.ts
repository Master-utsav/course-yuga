// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Procedure = (...args: any[]) => void;

export function throttle<F extends Procedure>(
  func: F,
  limit: number
): (this: ThisParameterType<F>, ...args: Parameters<F>) => void {
  let lastFunc: NodeJS.Timeout | null = null;
  let lastRan: number | undefined;

  return function (this: ThisParameterType<F>, ...args: Parameters<F>): void {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const context = this;

    if (!lastRan) {
      func.apply(context, args);
      lastRan = Date.now();
    } else {
      if (lastFunc) clearTimeout(lastFunc);

      lastFunc = setTimeout(() => {
        if (Date.now() - (lastRan ?? 0) >= limit) {
          func.apply(context, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - (lastRan ?? 0)));
    }
  };
}
