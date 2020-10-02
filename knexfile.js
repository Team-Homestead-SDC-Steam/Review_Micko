const path = require('path');
require('dotenv').config();

module.exports = {
  test: {
    client: 'pg',
    connection: {
      host: '127.0.0.1',
      // user: process.env.PG_USER,
      // password: process.env.PG_PASS || '',
      user: 'micko',
      password: 'test',
      database: 'steam_reviews'
    },
    migrations: {
      directory: path.resolve(__dirname, 'db', 'migrations')
    },
    seeds: {
      directory: path.resolve(__dirname, 'test', 'fixtures', 'seeds')
    }
  },
  development: {
    client: 'pg',
    connection: process.env.PGDB_URI || {
      host: '127.0.0.1',
      user: 'micko',
      password: 'test',
      database: 'steam_reviews'
    },
    migrations: {
      directory: path.resolve(__dirname, 'db', 'migrations')
    },
    seeds: {
      directory: path.resolve(__dirname, 'db', 'seeds')
    }
  },
  production: {
    client: 'pg',
    connection: process.env.PGDB_URI,
    migrations: {
      directory: path.resolve(__dirname, 'db', 'migrations')
    },
    seeds: {
      directory: path.resolve(__dirname, 'db', 'seeds', 'production')
    }
  }
};
