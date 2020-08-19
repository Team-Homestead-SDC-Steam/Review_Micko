// After creating all tables, create an index on the purchase_type column of the reviews table
exports.up = function(knex) {
  return knex.schema.table('reviews', (t) => {
    t.index('purchase_type', 'reviews_purchase_type');
  });
};

exports.down = function(knex) {
  return knex.schema.table('reviews', (t) => {
    t.dropIndex('purchase_type', 'reviews_purchase_type');
  });
};
