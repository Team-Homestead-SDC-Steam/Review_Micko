import { addCommaToCount, getPathId, getHumanReadableFromISO, fetchAllGameReviews, fetchReviewInfo } from '../../client/utils';

global.fetch = jest.fn().mockImplementation(() => Promise.resolve({
  ok: true,
  json: () => {}
}));

describe('addCommaToCount client util', () => {
  test('addCommaToCount adds commas in proper places to a stringfied number', () => {
    // Args given to count will always be integers
    let args = [1, 10, 100, 1000, 10000, 100000, 1000000];
    let expected = ['1', '10', '100', '1,000', '10,000', '100,000', '1,000,000'];
    args.forEach((arg, idx) => {
      expect(addCommaToCount(arg)).toBe(expected[idx]);
    });
  });

  test('getPathId gets the path of the current window', () => {
    global.window = Object.create(window);
    Object.defineProperty(window, 'location', {
      value: {
        pathname: '/app/test/3'
      }
    });
    expect(getPathId()).toBe(3);

    global.window.location.pathname = '/app/test/a';
    expect(getPathId()).toBe(1);

    global.window.location.pathname = '';
    expect(getPathId()).toBe(1);
  });

  test('getHumanReadableFromISO should return a human readable date string', () => {
    let years = new Array(10).fill(0).map((_, idx) => (idx + 2010).toString());
    let months = new Array(12).fill(0).map((_, idx) => (idx + 1).toString().padStart(2, '0'));
    let monthStrs = {
      '01': 'January',
      '02': 'February',
      '03': 'March',
      '04': 'April',
      '05': 'May',
      '06': 'June',
      '07': 'July',
      '08': 'August',
      '09': 'September',
      '10': 'October',
      '11': 'November',
      '12': 'December'
    };

    for (let i = 1; i <= 28; i++) {
      for (let j = 0; j < years.length; j++) {
        for (let k = 0; k < months.length; k++) {
          let ISOStr = `${years[j]}-${months[k]}-${String(i).padStart(2, '0')}T00:00:00Z`;
          expect(getHumanReadableFromISO(ISOStr)).toBe(`${parseInt(i)} ${monthStrs[months[k]]}, ${years[j]}`);
        }
      }
    }
  });

  test('fetchAllGameReviews calls the correct endpoint with passed in game id', async () => {
    await fetchAllGameReviews(3);
    expect(global.fetch).toHaveBeenCalledWith('/api/reviewcount/3');

    expect(() => fetchAllGameReviews(0)).toThrow();
    expect(() => fetchAllGameReviews(101)).toThrow();
  });

  test('fetchReviewInfo calls the correct endpoint with passed in game id', async () => {
    await fetchReviewInfo(3);
    expect(global.fetch).toHaveBeenCalledWith('/api/gamereviews/3');

    expect(() => fetchReviewInfo(0)).toThrow();
    expect(() => fetchReviewInfo(101)).toThrow();
  });
});
