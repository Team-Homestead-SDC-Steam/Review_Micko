// const environment = process.env.NODE_ENV || 'development';
const environment = 'test';
const config = require('../knexfile')[environment];
module.exports = require('knex')(config);
