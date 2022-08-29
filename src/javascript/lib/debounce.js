/**
 * https://www.freecodecamp.org/news/javascript-debounce-example/
 * Improvements:
 * - Execute immediately if a condition is met
 * - Pass the events to the functions
 *
 * @param {function(...any): boolean} skipFunc
 * @param {function(...any): void} doneFunc
 * @param {number} timeout
 * @returns {function(...any): void}
 */
export default function debounce(skipFunc, doneFunc, timeout = 250) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        if (skipFunc(...args))
            doneFunc(...args);
        else
            timer = setTimeout(doneFunc, timeout, ...args);
    };
}
