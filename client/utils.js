/**
   * Transforms a number into a human-readable, comma separated numString.
   * I.E. 1234567 -> 1,234,567
   * @param {Number} count
   * @returns {String}
   */
export const addCommaToCount = (count) => {
  return count.toString().replace(/(\d)(?=(\d{3})+$)/g, '$1,');
};

/**
 * Gets the id portion of window.location.pathname. Returns default (1) if invalid.
 * @returns {Number} int between 1-100, inclusive
 */
export const getPathId = () => {
  let pathArr = window.location.pathname.split('/');
  let pathId = 1;
  if (pathArr.length) {
    pathId = parseInt(pathArr.slice(-1)[0]);
    console.log(pathId);
    if (Number.isNaN(pathId) || pathId > 10000000 || pathId < 1) {
      pathId = 1;
    }
  }
  return pathId;
};

/**
 * Given an ISO date string (2020-06-01T00:00:00Z), format into
 * human readable date (1 Jun, 2020)
 * @param {String} ISOString
 * @returns {String}
 */
export const getHumanReadableFromISO = (ISOString) => {
  let months = {
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

  return `${parseInt(ISOString.slice(8, 10))} ${months[ISOString.slice(5, 7)]}, ${ISOString.slice(0, 4)}`;
};

/**
 * Get total, positive, and negative review count, plus semantic rating & % positive, from /api/reviews/:gameid
 * @param {Integer} gameid: int between 1-100, inclusive
 * @returns {Promise->Object}
 */
export const fetchAllGameReviews = (gameid) => {
  if (!gameid || gameid > 10000000 || gameid < 1) {
    throw new Error('Invalid game id');
  }

  return fetch(`/api/reviewcount/${gameid}`)
    .then(response => response.json());
};

const buildQuery = (filters) => {
  // Review Type: Positive, Negative
  // Purchase Type: Steam Purchasers, Other
  // Date Range: TODO - need to coordinate with Damien's graph service
  // Playtime: { min: Number, max: Number }
  // Display As: summary, most-helpful, recent, funny
  let params = new URLSearchParams();
  for (let key in filters) {
    if (filters[key] !== null) {
      if (key === 'Review Type' && ['Positive', 'Negative'].includes(filters[key])) {
        params.append('review_type', filters[key].toLowerCase());
      } else if (key === 'Purchase Type' && ['Steam Purchasers', 'Other'].includes(filters[key])) {
        params.append('purchase_type', filters[key].split(' ')[0].toLowerCase());
      } else if (key === 'Date Range') {
        // TODO
      } else if (key === 'Playtime' && filters[key].min !== undefined && filters[key].max !== undefined) {
        params.append('play_min', filters[key].min);
        params.append('play_max', filters[key].max);
      } else if (key === 'Display As' && ['summary', 'most-helpful', 'recent', 'funny'].includes(filters[key])) {
        params.append('display', filters[key].split('-').slice(-1)[0]);
      }
    }
  }
  return params.toString();
}

/**
 * Get purchase count and reviews data from /api/gamereviews/:gameid
 * @param {Integer} gameid: int between 1-100, inclusive
 * @returns {Promise->Object}
 */
export const fetchReviewInfo = (gameid, filters) => {
  if (!gameid || gameid > 10000000 || gameid < 1) {
    throw new Error('Invalid game id');
  }

  let queryParams = buildQuery(filters);
  let endpoint = `/api/gamereviews/${gameid}`;
  if (queryParams) {
    endpoint += `?${queryParams}`;
  }

  return fetch(endpoint)
    .then(response => response.json());
};

