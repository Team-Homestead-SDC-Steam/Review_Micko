var fs = require('fs');
var { Pool } = require('pg');
var copyFrom = require('pg-copy-streams').from;
const path = require('path');

var pool = new Pool({
  host: '127.0.0.1',
  port: 5432,
  user: 'micko',
  password: 'test',
  database: 'steam_reviews'
})

pool.connect().then(client => {
  console.log('starting..', Date());
  let done = (err) => {
    if (err) {
      console.log(err);
    }
    console.log("done", Date());
    client.release();
  }
  var stream = client.query(copyFrom(`COPY reviews (id_user,id_game,is_recommended,hours_on_record,hours_at_review_time,purchase_type,date_posted,received_free,review_text,num_found_helpful,num_found_funny,num_comments) FROM STDIN DELIMITER ',' CSV`))
  let csvPath = path.resolve(__dirname,'data-gen','csv-seeds', 'reviews.csv');
  var fileStream = fs.createReadStream(csvPath);
  fileStream.on('error', done)
  stream.on('error', done)
  stream.on('finish', done)
  fileStream.pipe(stream)
})
