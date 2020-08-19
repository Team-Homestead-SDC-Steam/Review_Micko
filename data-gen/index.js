const fs = require('fs');
const path = require('path');
const { writeToCsv } = require('./utils');
const { generateUserData } = require('./user');
const { generateReviewData } = require('./review');

let defaultPath = path.resolve(__dirname, 'csv-seeds');

/**
 * Generates a set amount of user data based on parameters, then writes results in .csv format to outDir
 * @param {Boolean} force: Whether to overwrite existing same-named .csv files at outDir
 * @param {String} outDir: Absolute path -- where to write the .csv file
 * @param {String} numUsers: Number of users to generate data for, between 1-750
 */
const createUsersFile = async (force = false, outDir = defaultPath, numUsers = 750) => {
  let userData;
  try {
    let files = await fs.promises.readdir(outDir);
    if (!force && files.includes('users.csv')) {
      console.error('\n\tusers.csv file already generated. Check', outDir);
      return;
    } else {
      userData = generateUserData(numUsers);
      await writeToCsv(
        userData,
        ['username', 'profileUrl', 'isOnline', 'numProducts', 'numReviews', 'steamLevel', 'idBadge', 'isInGame', 'inGameId', 'inGameStatus'],
        path.join(outDir, 'users.csv')
      );
    }
  } catch (e) {
    console.error(e);
  }
  return;
};

/**
 * Generates a set amount of user data based on parameters, then writes results in .csv format to outDir
 * @param {Boolean} force: Whether to overwrite existing same-named .csv files at outDir
 * @param {String} outDir: Absolute path -- where to write the .csv file
 * @param {Number} numReviews: Number of reviews to generate data for, between 1-2000
 * @param {Number} numGames: Number of games to generate data for, between 1-100
 */
const createReviewsFile = async (force = false, outDir = defaultPath, numReviews = 1000, numGames = 100, numUsers = 750) => {
  let reviewData;
  try {
    let files = await fs.promises.readdir(outDir);
    if (!force && files.includes('reviews.csv')) {
      console.error('\treviews.csv file already generated. Check', outDir);
      return;
    } else {
      reviewData = generateReviewData(numReviews, numGames, numUsers);
      await writeToCsv(
        reviewData,
        ['idUser', 'idGame', 'isRecommended', 'hoursOnRecord', 'hoursAtReviewTime', 'purchaseType', 'datePosted', 'receivedFree', 'reviewText', 'numFoundHelpful', 'numFoundFunny', 'numComments'],
        path.join(outDir, 'reviews.csv')
      );
    }
  } catch (e) {
    console.error(e);
  }
  return;
};

/**
 * Validates --force, --out-dir, --users, --reviews, --games, --auto-seed, and --env arg flags passed to current node process
 * Valid command line arguments:
 * --force: Force overwrite already-generated files in data-gen/csv-seeds directory or --out-dir, if present
 * --out-dir <directory>: generates .csv files into <directory>
 * --users [1-750]: generates [1-750] user csv lines (more is possible, but
 *                  since I only have 750 hosted URL profile pics in db/hostedUrls.json,
 *                  I'm limiting it to 750 for convenience. If absent, won't generate user .csv file.
 * --reviews [1-2000]: generates [1-2000] review csv lines, distributing reviews as evenly as
 *                     possible between the 100 games (again, more is possible, but anything
 *                     past 2000 isn't relevant for FEC). If absent, won't generate reviews .csv file.
 * --games [1-100]: sets the number of games to generate reviews for. Defaults to 100.
 *                  Useful is test environments, where one might want to generate reviews for a smaller set
 *                  of games for brevity.
 * --auto-seed: if present, automatically seeds the current process.env.NODE_ENV database
 * --env: Specifies env for seeding. If not present, --auto-seed has no effect & will result in error message.
 * @param {Array} args
 * @returns {Object}: object whose keys are valid flags and values, if present, are the values that will modify the behavior of this script
 */
const validateCLIArgs = async () => {
  let cliArgs = process.argv.slice(2);
  let usageMessage = '\tUsage: npm run gen-data [--force] [--out-dir <directory>] (--users <1-750>|--reviews <1-2000>) [--games <1-100>] [--auto-seed] [--env <test|development>]\n';
  if (cliArgs.length === 0 || !(cliArgs.includes('--users') || cliArgs.includes('--reviews'))) {
    console.error('Please include either --users or --reviews for their respective seeding counts.');
    console.error(usageMessage);
    process.exit(1);
  }
  let force = cliArgs.includes('--force');

  // Validate other flags. If any are invalid, throw an error to force-quit the process
  let outDir;
  if (cliArgs.includes('--out-dir')) {
    try {
      let argPath = path.resolve(__dirname, '..', cliArgs[cliArgs.indexOf('--out-dir') + 1]);
      await fs.promises.stat(argPath);
      outDir = argPath;
    } catch (err) {
      console.error('\n\t' + err.message + '\n');
      process.exit(1);
    }
  }

  let numUsers;
  if (cliArgs.includes('--users')) {
    let argNumUsers = cliArgs[cliArgs.indexOf('--users') + 1];
    if (argNumUsers < 1 || argNumUsers > 750) {
      console.error('\n\tInvalid number of users');
      console.error(usageMessage);
      process.exit(1);
    }
    numUsers = argNumUsers;
  }

  let numReviews;
  if (cliArgs.includes('--reviews')) {
    let argNumReviews = cliArgs[cliArgs.indexOf('--reviews') + 1];
    if (argNumReviews < 1 || argNumReviews > 2000) {
      console.error('\n\tInvalid number of reviews');
      console.error(usageMessage);
      process.exit(1);
    }
    numReviews = argNumReviews;
  }

  let numGames;
  if (cliArgs.includes('--games')) {
    let argNumGames = cliArgs[cliArgs.indexOf('--games') + 1];
    if (argNumGames < 1 || argNumGames > 100) {
      console.error('\n\tInvalid number of games');
      console.error(usageMessage);
      process.exit(1);
    }
    numGames = argNumGames;
  }

  let autoSeed = cliArgs.includes('--auto-seed');

  let env;
  if (cliArgs.includes('--env')) {
    let argEnv = cliArgs[cliArgs.indexOf('--env') + 1];
    if (!(argEnv === 'test' || argEnv === 'development')) {
      console.error('\n\tPlease specify either test or development environments for the --env flag.');
      console.error(usageMessage);
      process.exit(1);
    }
    env = argEnv;
  }

  if (autoSeed && !env) {
    console.error('\n\tPlease include the --env flag with the --auto-seed flag.');
    console.error(usageMessage);
    process.exit(1);
  }

  return { force, outDir, numUsers, numReviews, numGames, autoSeed, env };
};

/**
 * Called on executing 'node data-gen/index.js' with optional cli flags.
 * See list of cli flags for details. (TODO: Create documentation for cli usage & flags)
 *
 * Parses command line arguments entered on running the script listed in package.json,
 * then runs data generation according to those arguments.
 */
const parseArgsAndRunDataGen = async () => {
  let { force, outDir, numUsers, numReviews, numGames, autoSeed, env } = await validateCLIArgs();

  // Write users, reviews .csv files following force / outDir cli flags
  try {
    if (numUsers) {
      await createUsersFile(force, outDir, numUsers);
    }
  } catch (e) {
    console.error(e);
  }

  try {
    if (numReviews) {
      await createReviewsFile(force, outDir, numReviews, numGames, numUsers);
    }
  } catch (e) {
    console.error(e);
  }

  // Seeds db if --auto-seed and --env flags present
  if (autoSeed && env) {
    const config = require('../knexfile')[env];
    const db = require('knex')(config);
    await db.migrate.rollback()
      .then(() => db.migrate.latest())
      .then(() => db.seed.run())
      .then(() => console.log('\tDatabase seeding complete.\n'))
      .catch((e) => console.error('\tERROR: ' + e.message));
    await db.destroy();
  }
};

parseArgsAndRunDataGen();