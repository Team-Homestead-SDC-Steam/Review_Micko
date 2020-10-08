const cors = require('cors');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { getReviewsByGameIdWithUsersAndBadges, createNewReview } = require('../db/index');

app.use(bodyParser.json());
app.use(cors());

app.get('/gamereviews/:gameid', async (req, res) => {
  let { gameid } = req.params;
  console.log(req.originalUrl)
  if (parseInt(gameid) <= 0 || parseInt(gameid) > 10000000) {
    res.status(400).json({ error: 'Invalid game ID. Please use a number between 1 and 30000.' });
    return;
  }
  try {
    let payload = await getReviewsByGameIdWithUsersAndBadges(gameid, req.query);

    console.log(payload.data.length);

    let helpful;
    let recent;
    if ((req.query.display && req.query.display === 'summary') || !req.query.display) {
      recent = payload.data.slice().sort((a, b) => Date.parse(a.date_posted) > Date.parse(b.date_posted) ? -1 : 1);
      payload.recent = recent;
    }

    res.status(200).json(payload);

  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error retrieving reviews' });
  }
});

app.post('/create/batch', (req, res) => {
  let batch = req.body.data;
  insertReviewsByBatch(batch).then(() => {
    console.log("Inserted Batch!");
    res.send(200);
  }).catch(e => {
    console.error(e);
    res.send(501);
  })
})

app.post('/create/:id_game', (req, res) => {
  let options = req.body;
  console.log("Inserting new reviews");
  //console.log(options);
  createNewReview(options).then((result) => {
    console.log("Success!");
    res.send(201);
  }).catch(e => {
    console.error(e)
    res.send(501);
  });
})

app.listen(process.env.PORT || 4000, () => {
  console.log(`Server listening on port ${process.env.PORT || 4000}`);
});
