/**
 * 函数功能描述：防抖函数
 * @param {function} func 函数
 * @param {number} delay 等待时间
 */
export function debounce(func, delay = 500) {
  let timeoutId;

  return function () {
    const context = this;
    const args = arguments;

    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
}

// 节流函数
export function throttle(func, delay = 500) {
  let lastExecTime = 0;

  return function () {
    const context = this;
    const args = arguments;
    const currentTime = Date.now();

    if (currentTime - lastExecTime >= delay) {
      func.apply(context, args);
      lastExecTime = currentTime;
    }
  };
}