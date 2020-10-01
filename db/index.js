const db = require('./knex');
const { filterInvalid, buildSQLQuery, createSQLQuery, updateSQLQuery, deleteSQLQuery, buildJoinSQLQuery} = require('./utils');

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
  console.log(options)
  let query = buildSQLQuery(gameId, options);

  return db.raw(query).then(result => result.rows);
};

exports.getReviewsByGameIdWithUsersAndBadges = async (gameId, options) => {
  options = filterInvalid(options);
  let query = buildJoinSQLQuery(gameId, options);

  return db.raw(query).then(result => {
    let datas = result.rows;
    let reformatPayload = datas.reduce((payload, data) => {
      let formattedData = {
        id: data.id,
        id_user: data.id_user,
        id_game: data.id_game,
        is_recommended: data.is_recommended,
        hours_on_record: data.hours_on_record,
        hours_at_review_time: data.hours_at_review_time,
        purchase_type: data.purchase_type,
        date_posted: data.date_posted,
        received_free: data.received_free,
        num_found_helpful: data.num_found_helpful,
        num_found_funny: data.num_found_funny,
        num_comments: data.num_comments,
        review_text: data.review_text,
        user: {
          id: data.id_user,
          username: data.username,
          profile_url: data.profile_url,
          is_online: data.is_online,
          num_products: data.num_products,
          num_reviews: data.num_reviews,
          steam_level: data.steam_level,
          is_in_game: data.is_in_game,
          in_game_id: data.in_game_id,
          in_game_status: data.in_game_status,
          id_badge: data.id_badge,
          badge: {
            id: data.id_badge,
            title: data.title,
            xp: data.xp,
            badge_url: data.badge_url
          }
        }
      }

      payload.data.push(formattedData);

      if (data.purchase_type === 'direct') {
        payload.steamPurchasedCount++;
      }

      if (data.purchase_type === 'key') {
        payload.otherPurchasedCount++;
      }

      return payload;
    }, {
      steamPurchasedCount: 0,
      otherPurchasedCount: 0,
      data: []
    });

    // console.log(reformatPayload);
    return reformatPayload;
  });

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

//START OF CRUD API

exports.createNewReview = (options) => {
  return db('reviews').insert(options);
}

exports.updateReviewById = (id, option) => {
  let query = updateSQLQuery(id, option);

  return db.raw(query)
  .then(result => result)
  .catch(error => console.error(error));
}

exports.deleteReviewById = (id) => {
  let query = deleteSQLQuery(id);

  return db.raw(query)
  .then(result => result)
  .catch(error => console.error(error));
}