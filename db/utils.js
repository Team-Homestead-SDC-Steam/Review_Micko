/**
 * Given a URL query parameter object, filter out invalid req.query key-value pairs
 * @param {Object} options
 * @returns {Object} filter options
 */
exports.filterInvalid = ({ review_type, purchase_type, from, to, exclude, play_min, play_max, display }) => {
  let valid = {};
  ['all', 'positive', 'negative'].includes(review_type) ? valid.review_type = review_type : 0;
  ['all', 'steam', 'other'].includes(purchase_type) ? valid.purchase_type = purchase_type : 0;

  // Number.isNaN is used below to validate req.query parameters
  !Number.isNaN(Date.parse(from)) ? valid.from = from : 0;
  !Number.isNaN(Date.parse(to)) ? valid.to = to : 0;

  // Even though playtime is specified as a float in the db, parseInt is used to simplify querying
  !Number.isNaN(parseInt(play_min)) ? valid.play_min = play_min : 0;
  !Number.isNaN(parseInt(play_max)) ? valid.play_max = play_max : 0;

  ['true', 'false'].includes(exclude) ? valid.exclude = exclude : 0;
  ['summary', 'helpful', 'recent', 'funny'].includes(display) ? valid.display = display : 0;
  return valid;
};

/**
 * Builds a SQL query string from parameters for use with db.raw() Knex method
 * @param {Number} gameId
 * @param {Object} options: valid options object returned from filterInvalid
 * @returns {String}: Valid SQL query string
 */
exports.buildSQLQuery = (gameId, options) => {
  let { review_type, purchase_type, from, to, exclude, play_min, play_max, display } = options;

  /** All raw queries together translates to: (with some 'AND'-headed lines optional depending on options arg, and after input validation):
  * SELECT * FROM reviews
  * WHERE id_game = ${gameId}
  * AND is_recommended = ${review_type === 'positive'}
  * AND purchase_type = '${purchase_type === 'steam' ? 'direct' : 'key'}'
  * AND (${exclude ?
  *          `date_posted <= '${from}' OR date_posted >= '${to}'` :
  *          `date_posted >= '${from}' AND date_posted <= '${to}'`
  *     })
  * AND hours_at_review_time >= ${play_min}
  * AND hours_at_review_time <= ${play_max}
  * ORDER BY ${displayOption[display]} DESC;
  */
  let rawQueryBase = `SELECT * FROM reviews WHERE id_game = ${gameId}`;
  let isRecommendedStr = review_type && review_type !== 'all' ?
    ` AND is_recommended = ${review_type === 'positive'}` :
    '';
  let purchaseTypeStr = purchase_type && purchase_type !== 'all' ?
    ` AND purchase_type = '${purchase_type === 'steam' ? 'direct' : 'key'}'` :
    '';

  // If exclude is true, use OR filter instead of AND
  let excludeStr = exclude === 'true' && from && to ?
    ` AND (date_posted < '${from}' OR date_posted > '${to}')` :
    '';
  let datePostedFromStr = !excludeStr && from ?
    ` AND date_posted >= '${from}'` :
    '';
  let datePostedToStr = !excludeStr && to ?
    ` AND date_posted <= '${to}'` :
    '';
  let hoursMinStr = play_min ?
    ` AND hours_at_review_time >= ${play_min}` :
    '';
  let hoursMaxStr = play_max ?
    ` AND hours_at_review_time <= ${play_max}` :
    '';

  let displayStr = '';
  let displayOptions = {
    'helpful': ' ORDER BY num_found_helpful DESC',
    'recent': ' ORDER BY date_posted DESC',
    'funny': ' ORDER BY num_found_funny DESC'
  };
  if (display === 'summary' || !['summary', 'helpful', 'recent', 'funny'].includes(display)) {
    // Two reviews lists: left (Most Helpful) & right (Recently Posted)
    // Two sets of data to return -- order by helpful here, then sort by recent before returning in getReviewsByGameIdWithOptions
    displayStr = displayOptions['helpful'];
  } else {
    displayStr = displayOptions[display];
  }

  return rawQueryBase +
    isRecommendedStr +
    purchaseTypeStr +
    excludeStr +
    datePostedFromStr +
    datePostedToStr +
    hoursMinStr +
    hoursMaxStr +
    displayStr;
};

exports.createSQLQuery = (options) => {
  let randomNum = Math.floor(Math.random() * 200);

  let { id_user,
    id_game,
    is_recommended,
    hours_on_record,
    hours_at_review_time,
    purchase_type,
    date_posted,
    received_free,
    review_text } = options;

  let values = `${id_user},
    ${id_game},
    ${is_recommended},
    ${hours_on_record},
    ${hours_at_review_time},
    '${purchase_type}',
    '${date_posted}',
    ${received_free},
    '${review_text}',
    ${randomNum},
    ${randomNum},
    ${randomNum}`;
  //3 randomly generated number for num_found_helpful,funny,comments

  let columns = `
  id_user,
    id_game,
    is_recommended,
    hours_on_record,
    hours_at_review_time,
    purchase_type,
    date_posted,
    received_free,
    review_text,
    num_found_helpful,
    num_found_funny,
    num_comments`;

  let baseQuery = `INSERT INTO reviews
    (${columns}) VALUES (${values});`;

  console.log(baseQuery);

  return baseQuery;
}

exports.updateSQLQuery = (options) => {

  let columnAndValues = ``;
  let baseQuery = ``;

  for (let column in options) {
    let baseTemplate = `${column} = ${options[column]}`;

    if (column === 'purchase_type') {
      baseTemplate = `${column} = '${options[column]}'`;
    }

    if (column === 'date_posted') {
      baseTemplate = `${column} = '${options[column]}'`;
    }

    if (column === 'review_text') {
      baseTemplate = `${column} = '${options[column]}'`;
    }

    columnAndValues += baseTemplate + ',';
  }

  //remove last comma
  columnAndValues = columnAndValues.substring(0, columnAndValues.length - 1);
  //adding empty space at the end to seperate SQL commands
  columnAndValues += ' ';

  baseQuery = `UPDATE reviews SET ${columnAndValues} WHERE id = ${options.id}`;

  return baseQuery;
}

exports.deleteSQLQuery = (id) => {

  let baseQuery = `DELETE FROM reviews WHERE id = ${id}`;

  return baseQuery;
}