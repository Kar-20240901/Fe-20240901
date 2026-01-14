/**
 * 防抖：可以配置第一次是否立即执行，如果一段时间内持续触发，则执行最后那次
 */
export function debounceByKey(
  func: (...args: any[]) => void,
  delay: number,
  immediate: boolean = true
) {
  const timers: Record<string, number | null> = {};
  const firstCall: Record<string, boolean> = {};

  return function (key: string, ...args: any[]) {
    clearTimeout(timers[key]);

    if (immediate && !firstCall[key]) {
      // 首次触发立即执行
      firstCall[key] = true;
      func(...args);
    } else {
      // 设置延迟执行
      timers[key] = window.setTimeout(() => {
        func(...args);
        firstCall[key] = false;
        timers[key] = null;
      }, delay);
    }
  };
}

/**
 * 节流：可以配置第一次是否立即执行，如果一段时间内持续触发，则按照规律来执行，并且可以配置最后一次是否执行
 */
export function throttleByKey(
  fn: (...args: any[]) => void,
  delay: number,
  leading: boolean = true,
  trailing: boolean = true
) {
  const timers: Record<string, number | null> = {};
  const lastExecuteTime: Record<string, number | undefined> = {};

  // 包装后的节流函数
  return function (key: string, ...args: any[]) {
    const now = Date.now();

    if (lastExecuteTime[key] === undefined) {
      if (leading) {
        lastExecuteTime[key] = 0;
      } else {
        lastExecuteTime[key] = now;
      }
    }

    // 计算距离下次可执行的剩余时间
    const remainingTime = delay - (now - lastExecuteTime[key]);

    if (remainingTime <= 0) {
      if (timers[key]) {
        clearTimeout(timers[key]);
        timers[key] = null;
      }
      fn(...args);
      lastExecuteTime[key] = now;
    } else if (trailing) {
      if (timers[key]) {
        clearTimeout(timers[key]);
        timers[key] = null;
      }

      timers[key] = window.setTimeout(() => {
        lastExecuteTime[key] = Date.now();
        fn(...args);
        timers[key] = null;
      }, remainingTime);
    }
  };
}
