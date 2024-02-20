import { globalConstants } from '../constants/globalConstants';

export function debounce(func, timeout = globalConstants.debounceTime) {
  let timer;
  return (...args) => {
    if (!timer) {
      func.apply(this, args);
    }
    clearTimeout(timer);
    timer = setTimeout(() => {
      timer = undefined;
    }, timeout);
  };
}
