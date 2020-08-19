/**
 * Async/await implementation of native .forEach
 * Awaits results of previous callback in forEach loop before entering next.
 * @param {Array} arr
 * @param {Function} callback: asynchronous callback which accepts (val, idx, arr) parameters:
 * @param {*} val
 * @param {Number} idx
 * @param {Array} arr
 */
exports.asyncForEach = async (arr, callback) => {
  for (let i = 0; i < arr.length; i++) {
    await callback(arr[i], i, arr);
  }
};