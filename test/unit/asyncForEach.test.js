const { asyncForEach } = require('../../server/asyncForEach');

describe('asyncForEach utility function', () => {
  test('it calls callbacks in serial despite callback being asynchronous', async (done) => {
    let counter = 0;
    try {
      await asyncForEach([1, 2, 3, 4, 5], async (val, idx, arr) => {
        // Each instance of this async callback should finish before the next.
        // counter is used to track that, since counter must increment exactly once between each
        // callback call for assertions to pass.
        let resolveAfter100 = new Promise((resolve, reject) => {
          expect(idx).toBe(counter);
          expect(val).toBe(counter + 1);
          expect(arr).toStrictEqual([1, 2, 3, 4, 5]);
          setTimeout(() => { resolve(counter++); }, 100);
          setTimeout(() => { reject(); }, 200);
        });
        return resolveAfter100;
      });
    } catch (e) {
      // Shouldn't reach here, since rejects always happen 100ms after resolves
      console.error(e);
      expect(e).not.toBeDefined();
    }
    done();
  });
});