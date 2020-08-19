const fs = require('fs');
const path = require('path');
const { copyToTable } = require('../../../db/copyToTable');

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(() => {
      // Inserts seed entries from generated .csv data
      return knex.transaction(async (trx) => {
        const fileStream = fs.createReadStream(path.resolve(__dirname, '..', 'users.csv'));
        try {
          await copyToTable(
            trx,
            'users',
            [
              'username',
              'profile_url',
              'is_online',
              'num_products',
              'num_reviews',
              'steam_level',
              'id_badge',
              'is_in_game',
              'in_game_id',
              'in_game_status'
            ],
            fileStream
          );
        } catch (e) {
          console.error(e);
        }
      });
    });
};

