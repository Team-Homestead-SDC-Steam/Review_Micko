const fs = require('fs');
const faker = require('faker');
const writeReviewsData = fs.createWriteStream('./data-gen/csv-seeds/reviews.csv');

 const csvHeader = `id_user,id_game,is_recommended,hours_on_record,hours_at_review_time,purchase_type,date_posted,received_free,review_text,num_found_helpful,num_found_funny,num_comments\n`
//const csvHeader = '';

writeReviewsData.write(csvHeader, 'utf-8');

let generateRandomNum = (min = 1, max, float, precision = 10) => {
  return float ? Math.floor((Math.random() * (max - min) + 1000)) / precision : Math.floor(Math.random() * (max - min + 1)) + min
}

let randomBool = () => {
  let randomGen = Math.round(Math.random());
  return (randomGen) ? true : false;
}

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString();
}



let writeNreviews = (writer, encoding, callback) => {
  let i = 20000000; //30million

  let write = () => {
    let notFull = true;

    do {
      i--;
      let num_comments = generateRandomNum(0, 300, false);
      let num_found_funny = generateRandomNum(0, 200, false);
      let num_found_helpful = generateRandomNum(0, 100, false);
      let hours_at_review_time = generateRandomNum(1000, 5000, true, 100);
      let hours_on_record = generateRandomNum(1001, 5000, true);
      let is_recommended = randomBool();
      let purchase_type = randomBool ? 'direct' : 'key';
      let date_posted = randomDate(new Date(2012, 0, 1), new Date());
      let id_user = generateRandomNum(1, 750, false);
      let id_game = generateRandomNum(1, 10000000, false); //30000 games to distribute 10M reviews
      let received_free = randomBool();
      let review_text = faker.lorem.paragraph();

      // if(i < 10000000) {
      //   id_game = generateRandomNum(9900000, 10000000, false); //last 1mill rows will be tied to game_id between 9.9M-10M id to use for stress testing
      //   console.log(id_game);
      //   if (id_game > 10000000) {
      //     return; //randomNum check to see if  new implementation actually works
      //   }
      // }

      const lineToWrite = `${id_user},${id_game},${is_recommended},${hours_on_record},${hours_at_review_time},${purchase_type},${date_posted},${received_free},${review_text},${num_found_helpful},${num_found_funny},${num_comments}\n`
      console.log(`Wrote **${i}** records`);

      if (i === 0) {
        console.log("DONE!")
        writer.write(lineToWrite, encoding, callback);
      } else {
        notFull = writer.write(lineToWrite, encoding);
      }

    } while (i > 0 && notFull) {
      console.log("****DRAINING****");
      if (i > 0) {
        writer.once('drain', write)
      }
    };

  }
  write();
}
writeNreviews(writeReviewsData, 'utf-8', () => {
  writeReviewsData.end();
});

/*
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
*/