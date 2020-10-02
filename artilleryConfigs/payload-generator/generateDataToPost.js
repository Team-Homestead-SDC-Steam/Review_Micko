const faker = require('faker');

let generateRandomNum = (min = 1, max, float, precision = 10) => {
  return float ? Math.floor((Math.random() * (max - min) + 1000)) / precision : Math.floor(Math.random() * (max - min + 1)) + min
}

let randomBool = () => {
  let randomGen = Math.round(Math.random());
  return (randomGen) ? true : false;
}

let randomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString();
}

let generateData = (userContext, events, done) => {
  let num_comments = generateRandomNum(0, 300, false);
  let num_found_funny = generateRandomNum(0, 200, false);
  let num_found_helpful = generateRandomNum(0, 100, false);
  let hours_on_record = generateRandomNum(1000, 5000, true);
  let hours_at_review_time = generateRandomNum(100, 5000, true, 100);
  let is_recommended = randomBool();
  let purchase_type = randomBool ? 'direct' : 'key';
  let date_posted = randomDate(new Date(2012, 0, 1), new Date());
  let id_user = generateRandomNum(1, 750, false);
  let id_game = generateRandomNum(20000, 30000, false); //id between 20k to 30k to target last 10% of data
  let received_free = randomBool();
  let review_text = faker.lorem.paragraph();

  userContext.vars.num_comments = num_comments;
  userContext.vars.num_found_funny = num_found_funny;
  userContext.vars.num_found_helpful = num_found_helpful;
  userContext.vars.hours_at_review_time = hours_at_review_time;
  userContext.vars.hours_on_record = hours_on_record;
  userContext.vars.is_recommended = is_recommended;
  userContext.vars.purchase_type = purchase_type;
  userContext.vars.date_posted = date_posted;
  userContext.vars.id_user = id_user;
  userContext.vars.id_game = id_game;
  userContext.vars.received_free = received_free;
  userContext.vars.review_text = review_text;

  return done();
}

module.exports = {
  generateData
};