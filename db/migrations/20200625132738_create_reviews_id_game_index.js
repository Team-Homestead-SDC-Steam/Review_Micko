// After creating all tables, create an index on the id_game column of the reviews table
exports.up = function (knex) {
  return knex.schema.table('reviews', (t) => {
    t.index('id_game', 'reviews_id_game');
  });
};

exports.down = function (knex) {
  return knex.schema.table('reviews', (t) => {
    t.dropIndex('id_game', 'reviews_id_game');
  });
};
