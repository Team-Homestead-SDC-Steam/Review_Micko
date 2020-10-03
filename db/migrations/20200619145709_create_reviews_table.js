// Migrated straight from legacy seed.sql file, thus using .raw to not rewrite anything
exports.up = function(knex) {
  return knex.raw(
    'CREATE TABLE reviews(' +
      'id SERIAL PRIMARY KEY,' +
      'id_user INTEGER REFERENCES users(id),' +
      'id_game INTEGER NOT NULL CONSTRAINT game_id_range CHECK(id_game >= 1 AND id_game <= 10_000_000),' +
      'is_recommended BOOLEAN,' +
      'hours_on_record NUMERIC(5, 1),' +
      'hours_at_review_time NUMERIC(5, 1) CHECK(hours_at_review_time <= hours_on_record),' +
      'purchase_type VARCHAR(10) CHECK (purchase_type IN (\'direct\', \'key\')),' +
      'date_posted DATE,' +
      'received_free BOOLEAN,' +
      'review_text TEXT,' +
      'num_found_helpful SMALLINT,' +
      'num_found_funny SMALLINT,' +
      'num_comments SMALLINT' +
    ');'
  );
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('reviews');
};
