
/**
 * subsequent an interval to `number` elements
 * 
 * @param {number} a 
 * @param {number} b 
 * @param {number} number 
 * @returns {number[]}
 */
export function arange(a, b, number=3) {
    let step = (b-a) / number;
    let result = [a];
    for (let i = 0;i < number-1; i++) {
        result.push(result[result.length-1] + step);
    }
    result.push(b);
    return result;
}

/**
 * wait a `timeout` microsecond after execute a `callback`
 * 
 * @param {Function} callback 
 * @param {number} timeout 
 * @returns {Promise<void>}
 */
export function wait(callback, timeout) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            callback();
            resolve();
        }, timeout);
    });
}

/**
 * wait `timeout` microsecond before executing a `callback`
 * 
 * @param {Function} func 
 * @param {number} timeout 
 * @returns {Function}
 */
export function debounce(func, timeout = 100) {
    let timer = 0;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => { func(...args); }, timeout);
    };
}