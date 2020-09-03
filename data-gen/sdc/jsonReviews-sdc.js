const fs = require('fs');
const faker = require('faker');

const writeReviewsData = fs.createWriteStream('reviews.json');

let generateRandomNum = (min = 1, max, float) => {
  return float ? Math.floor((Math.random() * (max - min) + 1000)) / 10 : Math.floor((Math.random() * max) + min)
}

let randomBool = () => {
  let randomGen = Math.round(Math.random());
  return (randomGen) ? true : false;
}

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString();
}



let writeNreviews = (writer, encoding, callback) => {
  let i = 100; //10million

  writer.write('[', 'utf-8');

  let write = () => {
    let notFull = true;

    do {
      i--;
      let num_comments = generateRandomNum(0, 300, false);
      let num_found_funny = generateRandomNum(0, 200, false);
      let num_found_helpful = generateRandomNum(0, 100, false);
      let hours_at_review_time = generateRandomNum(100, 1000, true);
      let hours_on_record = generateRandomNum(100, 1000, true);
      let is_recommended = randomBool();
      let purchase_type = randomBool ? 'direct' : 'key';
      let date_posted = randomDate(new Date(2012, 0, 1), new Date());
      let id_user = generateRandomNum(1, 100, false);
      let id_game = generateRandomNum(1, 100, false);
      let received_free = randomBool();
      let review_text = faker.lorem.paragraph();

      const lineToWrite = `{"id_user": ${id_user},"id_game": ${id_game},"is_recommended": ${is_recommended},"hours_on_record": ${hours_on_record},"hours_at_review_time": ${hours_at_review_time},"purchase_type": "${purchase_type}","date_posted": "${date_posted}","received_free": ${received_free},"review_text": "${review_text}","num_found_helpful": ${num_found_helpful},"num_found_funny": ${num_found_funny},"num_comments": ${num_comments}}`

      console.log(`Wrote **${i}** records`);

      if (i === 0) {
        console.log("DONE!")
        writer.write(lineToWrite + ']', encoding, callback);
      } else {
        notFull = writer.write(lineToWrite + ', \n', encoding);
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