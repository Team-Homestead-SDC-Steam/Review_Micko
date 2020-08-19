const faker = require('faker');
const hostedUserUrls = require('../db/hostedUrls.json').profiles;

/**
 * Generates numUsers units of user data based on users schema
 * @param {Number} numUsers
 * @returns {Array}: numUsers elements long
 */
const generateUserData = (numUsers = 750) => {
  /**
 * Rules:
 * 1. Usernames must be unique
 * 2. id_badge must be between 1 and 16, in_game_id between 1 and 100
 * 3. num_reviews must be between 1 and num_products
 * 4. If isOnline is false, is_in_game is false and in_game_id/in_game_status are null
 */

  // Generate usernames & ensure uniqueness before generating other data
  let userData = [];
  for (let i = 0; i < numUsers; i++) {
    let randomUsername;
    do {
      randomUsername = faker.internet.userName();
    } while (userData.includes(randomUsername));
    userData.push(randomUsername);
  }

  // Generate other data specified in users schema (seed.sql)
  userData = userData.map((username) => {
    let userObj = {
      username,
      profileUrl: hostedUserUrls.pop(),
      isOnline: Math.random() < 0.5,
      numProducts: Math.ceil(Math.random() * 200),
      steamLevel: Math.ceil(Math.random() * 50),
      idBadge: Math.random() < 0.5 ? Math.ceil(Math.random() * 16) : '',
    };

    // Rule 3
    userObj.numReviews = Math.ceil(Math.random() * userObj.numProducts);

    // Rule 4
    userObj.isInGame = userObj.isOnline ? Math.random() < 0.5 : false;
    userObj.inGameId = userObj.isInGame ? Math.ceil(Math.random() * 100) : '';
    userObj.inGameStatus = userObj.isInGame ? faker.hacker.phrase() : '';

    return userObj;
  });

  console.log('\n\tUsers data generated. Writing to .csv file...');
  return userData;
};

module.exports.generateUserData = generateUserData;
