// Migrated straight from legacy seed.sql file, thus using .raw to not rewrite anything
exports.up = function (knex) {
  return knex.raw(
    'CREATE TABLE users(' +
      'id SERIAL PRIMARY KEY,' +
      'username VARCHAR(50),' +
      'profile_url TEXT,' +
      'is_online BOOLEAN,' +
      'num_products SMALLINT,' +
      'num_reviews SMALLINT,' +
      'steam_level SMALLINT,' +
      'id_badge INTEGER REFERENCES badges(id),' +
      'is_in_game BOOLEAN,' +
      'in_game_id INTEGER CONSTRAINT game_id_range CHECK(in_game_id >= 1 AND in_game_id <= 10000000),' +
      'in_game_status TEXT' +
    ');'
  );
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('users');
};
