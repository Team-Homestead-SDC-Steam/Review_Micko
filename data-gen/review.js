const faker = require('faker');

/**
 * Generates n unique ids between low and high, inclusive,
 * with a preference for unused ids
 * @param {Integer} low
 * @param {Integer} high
 * @param {Integer} n
 * @param {Array} idArr: array of unused user ids to pop from before randomly generating an id
 * @returns {Array} array length n
 */
const generateNUniqueIds = (low, high, n, idArr) => {
  let result = [];
  for (let i = 0; i < n; i++) {
    let uniqueId;
    if (idArr.length) {
      let randIdx = Math.floor(Math.random() * idArr.length);
      uniqueId = idArr[randIdx];
      idArr.splice(randIdx, 1);
    } else {
      do {
        uniqueId = Math.floor(Math.random() * high) + low;
        // BREAKING CASE: ids generated are not unique. This case will probably only happen during testing,
        // where there won't be tests to see if one user has written more than one review for the same game.
        // Else, someone will have to revisit this function to fix the id generation, if they want a range of
        // different users reviewing each game. In short, this exception doesn't break the data generation.
        if (high - low < n) {
          break;
        }
      } while (result.includes(uniqueId));
    }
    result.push(uniqueId);
  }
  return result;
};

/**
 * Generates numReviews units of review data based on reviews schema
 * @param {Number} numReviews
 * @param {Number} numGames
 * @param {Number} numUsers
 * @returns {Array}: numReviews elements long
 */
exports.generateReviewData = (numReviews = 1000, numGames = 100, numUsers = 750) => {
  /**
   * Rules:
   * 1. id_user must be between 1-NUM_USERS (750)
   * 2. id_game must be between 1-100
   * 3. hours_at_review_time must not exceed hours_on_record
   * 4. purchase_type must be one of ('direct', 'key')
   * 5. date_posted must be weighted to be more recent
   * 6. A user may only review a game at most 1 time
   * 7. Each user reviews at least 1 game
   */
  let unusedUserIds = new Array(numUsers).fill(0).map((_, idx) => idx + 1);

  // Get a count of how many reviews to generate per game
  let reviewGameIds = {};
  for (let i = 0; i < numReviews; i++) {
    let gameId = (i % numGames) + 1;
    reviewGameIds[gameId] ? reviewGameIds[gameId]++ : reviewGameIds[gameId] = 1;
  }

  // Fill reviewData with arrays of a game id, ensuring roughly equal game id distribution
  // i.e. numReviews = 10, numGames = 3 ---> [[1,1,1,1], [2,2,2], [3,3,3]]
  let reviewIds = [];
  for (let key in reviewGameIds) {
    reviewIds.push(new Array(reviewGameIds[key]).fill(parseInt(key)));
  }

  // Generate other data specified in reviews schema
  // Rules: 1, 2, 6, 7
  let reviewData = [];
  for (let i = 0; i < reviewIds.length; i++) {
    let gameAndUserIdTuples = generateNUniqueIds(1, numUsers, reviewIds[i].length, unusedUserIds)
      .map(idUser => ({
        idGame: reviewIds[i][0],
        idUser
      }));
    reviewData.push(...gameAndUserIdTuples);
  }


  let msIn1Year = 1000 * 60 * 60 * 24 * 365;
  let msIn30Days = 1000 * 60 * 60 * 24 * 30;
  // Rule 4 (purchaseType === 'direct' || 'key')
  reviewData = reviewData.map(({ idGame, idUser }) => {
    let reviewObj = {
      idUser,
      idGame,
      isRecommended: Math.random() < parseFloat(Math.random().toFixed(1)),
      hoursOnRecord: parseFloat((Math.random() * 4000).toFixed(1)),
      purchaseType: Math.random() < 0.5 ? 'direct' : 'key',
      receivedFree: Math.random() < 0.1,
      reviewText: Math.random() < 0.5 ? faker.lorem.paragraph() : `${faker.lorem.paragraph()} ${faker.lorem.paragraph()} ${faker.lorem.paragraph()}`,
      numFoundHelpful: Math.floor(Math.random() * 800),
      numFoundFunny: Math.floor(Math.random() * 800),
      numComments: Math.floor(Math.random() * 100)
    };

    // Rule 3 (hoursAtReviewTime <= hoursOnRecord)
    // Rule 5 (datePosted constraints) - 65% chance of being in the last 30 days
    reviewObj.hoursAtReviewTime = parseFloat((Math.random() * reviewObj.hoursOnRecord).toFixed(1));
    let datePostedMs = Date.now();
    Math.random() <= 0.65 ? datePostedMs -= Math.floor(Math.random() * msIn30Days) : datePostedMs -= Math.floor(Math.random() * msIn1Year);
    let date = new Date(datePostedMs);
    reviewObj.datePosted = date.toISOString();
    return reviewObj;
  });

  console.log('\n\tReviews data generated. Writing to .csv file...');
  return reviewData;
};

module.exports.generateNUniqueIds = generateNUniqueIds;
