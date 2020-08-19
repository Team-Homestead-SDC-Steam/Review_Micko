const { filterInvalid, buildSQLQuery } = require('../../db/utils');

describe('Database query-building utilities', () => {
  test('filterInvalid should filter input to remove invalid key-val pairs (without mutating)', () => {
    // filterValid will only ever take an object with 0-all of the following keys:
    // review_type, purchase_type, from, to, exclude, play_min, play_max, display
    expect(filterInvalid({})).toStrictEqual({});
    expect(filterInvalid({ invalidKey: 'invalidVal' })).toStrictEqual({});

    let validValues = {
      review_type: ['all', 'positive', 'negative'],
      purchase_type: ['all', 'steam', 'other'],
      display: ['summary', 'helpful', 'recent', 'funny'],
      exclude: ['true', 'false']
    };
    validValues.review_type.forEach(validReview => {
      validValues.purchase_type.forEach(validPurchase => {
        validValues.display.forEach(validDisplay => {
          validValues.exclude.forEach(validExclude => {
            let validObj = {
              review_type: validReview,
              purchase_type: validPurchase,
              display: validDisplay,
              exclude: validExclude
            };
            expect(filterInvalid(validObj)).toStrictEqual(validObj);
          });
        });
      });
    });

    // filterInvalid doesn't handle range checks, neither does buildSQLQuery.
    // An invalid date range will just return an empty query.
    let validDate = { from: '2020-04-01', to: '2020-03-20' };
    expect(filterInvalid(validDate)).toStrictEqual(validDate);
    expect(filterInvalid({ from: '2200-03-04', to: '2019-40-60' })).toStrictEqual({ from: '2200-03-04' });
    expect(filterInvalid({ from: '20:00:00', to: '2020-3-4 25:00:00' })).toStrictEqual({});

    // filterInvalid / buildSQLQuery also don't handle play_max/min conflicts
    let validPlayTimes = { play_min: 10, play_max: 100 };
    expect(filterInvalid(validPlayTimes)).toStrictEqual(validPlayTimes);
    expect(filterInvalid({ play_min: -Infinity, play_max: 1 })).toStrictEqual({ play_max: 1 });
    expect(filterInvalid({ play_min: 101, play_max: 0 })).toStrictEqual({ play_min: 101, play_max: 0 });
  });

  test('buildSQLQuery forms a query string from a game id and an options object', () => {
    let argsWithExpected = [
      [
        1,
        {},
        'SELECT * FROM reviews WHERE id_game = 1 ORDER BY num_found_helpful DESC'
      ],
      [
        1,
        { review_type: 'positive', purchase_type: 'steam' },
        'SELECT * FROM reviews WHERE id_game = 1 AND is_recommended = true AND purchase_type = \'direct\' ORDER BY num_found_helpful DESC'
      ],
      [
        1,
        { review_type: 'negative', purchase_type: 'other' },
        'SELECT * FROM reviews WHERE id_game = 1 AND is_recommended = false AND purchase_type = \'key\' ORDER BY num_found_helpful DESC'
      ],
      [
        101,
        { exclude: 'true', from: '2020-04-30', to: '2020-05-30', display: 'funny' },
        'SELECT * FROM reviews WHERE id_game = 101 AND (date_posted < \'2020-04-30\' OR date_posted > \'2020-05-30\') ORDER BY num_found_funny DESC'
      ],
      [
        50,
        { from: '2020-04-30', to: '2020-05-30', display: 'recent' },
        'SELECT * FROM reviews WHERE id_game = 50 AND date_posted >= \'2020-04-30\' AND date_posted <= \'2020-05-30\' ORDER BY date_posted DESC'
      ],
      [
        40,
        { play_min: 1, play_max: 100 },
        'SELECT * FROM reviews WHERE id_game = 40 AND hours_at_review_time >= 1 AND hours_at_review_time <= 100 ORDER BY num_found_helpful DESC'
      ],
      [
        30,
        { exclude: 'true', from: '2020-04-30', to: '2020-05-30', play_min: 1 },
        'SELECT * FROM reviews WHERE id_game = 30 AND (date_posted < \'2020-04-30\' OR date_posted > \'2020-05-30\') AND hours_at_review_time >= 1 ORDER BY num_found_helpful DESC'
      ],
      [
        20,
        { from: '2020-04-30', to: '2020-05-30', play_max: 20 },
        'SELECT * FROM reviews WHERE id_game = 20 AND date_posted >= \'2020-04-30\' AND date_posted <= \'2020-05-30\' AND hours_at_review_time <= 20 ORDER BY num_found_helpful DESC'
      ]
    ];

    argsWithExpected.forEach(([gameId, options, expected]) => {
      expect(buildSQLQuery(gameId, options)).toBe(expected);
    });
  });
});