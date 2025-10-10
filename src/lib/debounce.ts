/**
 * Debounce function that can execute immediately if a condition is met
 * 
 * @param skipFunc - Function that determines if debouncing should be skipped
 * @param doneFunc - Function to execute after debounce or immediately
 * @param timeout - Debounce timeout in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends unknown[]>(
  skipFunc: (...args: T) => boolean,
  doneFunc: (...args: T) => void,
  timeout = 250
): (...args: T) => void {
  let timer: ReturnType<typeof setTimeout> | undefined;
  
  return (...args: T) => {
    if (timer) {
      clearTimeout(timer);
    }
    
    if (skipFunc(...args)) {
      doneFunc(...args);
    } else {
      timer = setTimeout(() => doneFunc(...args), timeout);
    }
  };
}
