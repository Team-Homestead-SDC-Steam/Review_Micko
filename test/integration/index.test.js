process.env.NODE_ENV = 'test';
require('dotenv').config();
const db = require('../../db/knex');
const { dbTest } = require('./dbTest');
const { routesTest } = require('./routesTest');

// Tests must have configured like so, instead of having separate
// db.test.js and routes.test.js files, because of Jest's parallel test
// runner. Another option is the enable the --runInBand flag, but that
// would slow down the tests that don't need to run in serial, thus making
// the tests take longer (currently at ~10 sec at time of writing index.test.js).

// These tests must run in serial because of the interaction with a singular test db
describe('Serial DB and Routes tests', () => {
  beforeAll(() => {
    return db.migrate.rollback()
      .then(() => db.migrate.latest())
      .then(() => db.seed.run());
  });

  afterAll(() => {
    return db.destroy();
  });

  dbTest();
  console.log = jest.fn(); // Suppress app.listen's console.log
  routesTest();
});

process.env.NODE_ENV = undefined;
