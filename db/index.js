const db = require('./knex');
const { filterInvalid, buildSQLQuery } = require('./utils');

/**
 * Gets the purchase details for a game, i.e. num direct Steam purchases & num key purchases
 * @param {Number} gameId
 */
exports.getPurchaseTypeDataForGameId = async (gameId) => {
  return db.select('purchase_type')
    .from('reviews')
    .where('id_game', gameId)
    .then(rows => {
      return rows.reduce((acc, { purchase_type }) => {
        acc[purchase_type]++;
        return acc;
      }, { direct: 0, key: 0 });
    });
};

/**
 * Gets the <=10 reviews generated for a game id with filtering and/or ordering options
 * @param {Number} gameId
 * @param {Object} options
 * @returns {Promise->Array|Object}: promise which resolves to array of review data, or
 *                                   object if display === 'summary' (needs most helpful AND recently posted)
 */
exports.getReviewsByGameIdWithOptions = async (gameId, options) => {
  options = filterInvalid(options);
  let query = buildSQLQuery(gameId, options);

  return db.raw(query).then(result => result.rows);
};

/**
 * Gets a user by their id
 * @param {Number} userId
 * @returns {Array}: array length 1, containing user details object (or array length 0)
 */
exports.getUserById = (userId) => {
  return db('users')
    .where('id', userId);
};

/**
 * Gets a badge by its id
 * @param {Number} badgeId
 * @returns {Array}: array length 1, containing badge details object (or array length 0)
 */
exports.getBadgeById = (badgeId) => {
  return db('badges')
    .where('id', badgeId);
};