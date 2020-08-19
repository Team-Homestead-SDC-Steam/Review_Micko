/* eslint-disable camelcase */
const badgeUrls = require('../../../db/hostedUrls.json').badges;

let insertArray = [
  {
    title: 'Product Registration',
    xp: 100
  },
  {
    title: 'Pillar of Community',
    xp: 100
  },
  {
    title: 'Community Ambassador',
    xp: 200
  },
  {
    title: 'Community Leader',
    xp: 500
  },
  {
    title: '1 Year of Service',
    xp: 50
  },
  {
    title: '2 Years of Service',
    xp: 100
  },
  {
    title: '3 Years of Service',
    xp: 150
  },
  {
    title: '4 Years of Service',
    xp: 200
  },
  {
    title: '5 Years of Service',
    xp: 250
  },
  {
    title: 'One-Stop Shopper',
    xp: 100
  },
  {
    title: 'Select Collector',
    xp: 125
  },
  {
    title: 'Adept Accumulator',
    xp: 150
  },
  {
    title: 'Sharp-Eyed Stockpiler',
    xp: 200
  },
  {
    title: 'Collection Agent',
    xp: 250
  },
  {
    title: 'Power Player',
    xp: 325
  },
  {
    title: 'Game Mechanic',
    xp: 500
  }
];

insertArray = insertArray.map((row, idx) => ({
  ...row,
  badge_url: badgeUrls[idx]
}));

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('badges').del()
    .then(() => {
      // Inserts seed entries (16 total)
      return knex('badges').insert(insertArray);
    });
};
