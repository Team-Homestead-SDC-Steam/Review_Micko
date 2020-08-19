const fs = require('fs');
const path = require('path');
const { copyToTable } = require('../../../db/copyToTable');

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('reviews').del()
    .then(() => {
      // Inserts seed entries from generated .csv data
      return knex.transaction(async (trx) => {
        const fileStream = fs.createReadStream(path.resolve(__dirname, '..', 'reviews.csv'));
        try {
          await copyToTable(
            trx,
            'reviews',
            [
              'id_user',
              'id_game',
              'is_recommended',
              'hours_on_record',
              'hours_at_review_time',
              'purchase_type',
              'date_posted',
              'received_free',
              'review_text',
              'num_found_helpful',
              'num_found_funny',
              'num_comments'
            ],
            fileStream
          );
        } catch (e) {
          console.error(e);
        }
      });
    });
};
