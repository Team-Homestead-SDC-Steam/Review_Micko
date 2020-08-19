/* eslint-disable camelcase */

// Mock data for api call to Jeremy's dlc service, which will provide the name of the game
export const gameTitle = {
  id: 1,
  name: 'Untitled Steam Game'
};

// Mock data for api call to Damien's review-graph service, which should return data in this shape
export const gameRating = {
  summary: 'Mostly Positive',
  percent: 67,
  positive: 4,
  negative: 2,
  total: 6
};

const badges = [
  {
    id: 1,
    title: 'Badge One',
    xp: 100,
    badge_url: 'https://test.com/image.jpg'
  },
  {
    id: 2,
    title: 'Badge Two',
    xp: 200,
    badge_url: 'https://test.com/image.jpg'
  },
  {
    id: 3,
    title: 'Badge Three',
    xp: 300,
    badge_url: 'https://test.com/image.jpg'
  }
];

const users = [
  {
    id: 1,
    username: 'User1',
    profile_url: 'https://test.com/image.jpg',
    is_online: true,
    num_products: 100,
    num_reviews: 10,
    steam_level: 1,
    id_badge: 1,
    badge: badges[0],
    is_in_game: true,
    in_game_id: 1,
    in_game_status: 'Game 1 sample status'
  },
  {
    id: 2,
    username: 'User2',
    profile_url: 'https://test.com/image.jpg',
    is_online: false,
    num_products: 200,
    num_reviews: 20,
    steam_level: 10,
    id_badge: null,
    badge: null,
    is_in_game: false,
    in_game_id: null,
    in_game_status: null
  },
  {
    id: 3,
    username: 'User3',
    profile_url: 'https://test.com/image.jpg',
    is_online: true,
    num_products: 300,
    num_reviews: 30,
    steam_level: 20,
    id_badge: 2,
    badge: badges[1],
    is_in_game: false,
    in_game_id: null,
    in_game_status: null
  },
  {
    id: 4,
    username: 'User4',
    profile_url: 'https://test.com/image.jpg',
    is_online: false,
    num_products: 400,
    num_reviews: 40,
    steam_level: 30,
    id_badge: 3,
    badge: badges[2],
    is_in_game: false,
    in_game_id: null,
    in_game_status: null
  },
  {
    id: 5,
    username: 'User5',
    profile_url: 'https://test.com/image.jpg',
    is_online: true,
    num_products: 500,
    num_reviews: 50,
    steam_level: 40,
    id_badge: 1,
    badge: badges[0],
    is_in_game: true,
    in_game_id: 1,
    in_game_status: 'Game 1 sample status'
  },
  {
    id: 6,
    username: 'User6',
    profile_url: 'https://test.com/image.jpg',
    is_online: true,
    num_products: 600,
    num_reviews: 60,
    steam_level: 50,
    id_badge: 3,
    badge: badges[2],
    is_in_game: false,
    in_game_id: null,
    in_game_status: null
  }
];

const reviews = [
  {
    id: 1,
    id_user: 1,
    user: users[0],
    id_game: 1,
    is_recommended: true,
    hours_on_record: '277.5',
    hours_at_review_time: '122.3',
    purchase_type: 'direct',
    date_posted: new Date().toISOString(),
    received_free: false,
    review_text: 'Review text 1',
    num_found_helpful: 200,
    num_found_funny: 100,
    num_comments: 5
  },
  {
    id: 2,
    id_user: 2,
    user: users[1],
    id_game: 1,
    is_recommended: false,
    hours_on_record: '50.5',
    hours_at_review_time: '9.5',
    purchase_type: 'key',
    date_posted: new Date().toISOString(),
    received_free: true,
    review_text: 'Review text 2',
    num_found_helpful: 100,
    num_found_funny: 10,
    num_comments: 60
  },
  {
    id: 3,
    id_user: 3,
    user: users[2],
    id_game: 1,
    is_recommended: false,
    hours_on_record: '1503.6',
    hours_at_review_time: '1111.1',
    purchase_type: 'key',
    date_posted: new Date().toISOString(),
    received_free: false,
    review_text: 'Review text 3',
    num_found_helpful: 678,
    num_found_funny: 444,
    num_comments: 88
  },
  {
    id: 4,
    id_user: 4,
    user: users[3],
    id_game: 1,
    is_recommended: true,
    hours_on_record: '888.8',
    hours_at_review_time: '777.7',
    purchase_type: 'key',
    date_posted: new Date().toISOString(),
    received_free: false,
    review_text: 'Review text 4',
    num_found_helpful: 555,
    num_found_funny: 666,
    num_comments: 8
  },
  {
    id: 5,
    id_user: 5,
    user: users[4],
    id_game: 1,
    is_recommended: true,
    hours_on_record: '8.8',
    hours_at_review_time: '7.7',
    purchase_type: 'direct',
    date_posted: new Date().toISOString(),
    received_free: false,
    review_text: 'Review text 5',
    num_found_helpful: 55,
    num_found_funny: 66,
    num_comments: 4
  },
  {
    id: 6,
    id_user: 6,
    user: users[5],
    id_game: 1,
    is_recommended: true,
    hours_on_record: '999.8',
    hours_at_review_time: '666.6',
    purchase_type: 'direct',
    date_posted: new Date().toISOString(),
    received_free: false,
    review_text: 'Review text 6',
    num_found_helpful: 10,
    num_found_funny: 600,
    num_comments: 4
  },
];

const purchasedCount = {
  steamPurchasedCount: 3,
  otherPurchasedCount: 3
};

// Most helpful, most recent sortings
export const summaryQueryRes = {
  ...purchasedCount,
  data: reviews.slice().sort((a, b) => a.num_found_helpful > b.num_found_helpful ? -1 : 1),
  recent: reviews.slice().sort((a, b) => Date.parse(a.date_posted) > Date.parse(b.date_posted) ? -1 : 1)
};

// Funniest sorting
export const funnyQueryRes = {
  ...purchasedCount,
  data: reviews.slice().sort((a, b) => a.num_found_funny > b.num_found_funny ? -1 : 1)
};

