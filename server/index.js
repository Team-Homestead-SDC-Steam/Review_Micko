require('dotenv').config();
require('newrelic');
const path = require('path');
const fetch = require('node-fetch');
const cors = require('cors');
const express = require('express');
const expressStaticGzip = require('express-static-gzip');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');

//applying redis
const redis = require('redis');
const client = redis.createClient();

const { getPurchaseTypeDataForGameId, getReviewsByGameIdWithOptions, getUserById, getBadgeById, createNewReview, updateReviewById, deleteReviewById, getReviewsByGameIdWithUsersAndBadges } = require('../db/index');
//const { asyncForEach } = require('./asyncForEach');

//implementing clustering
// const cluster = require('cluster');
// const numCPUs = require('os').cpus().length;
// console.log(`We have ${numCPUs} available`);

// if (cluster.isMaster) {
//   console.log(`Master ${process.pid} is running`);

//   for (let i = 0; i < numCPUs; i++) {
//     cluster.fork();
//   }
//   cluster.on('exit', (worker, code, signal) => {
//     console.log(`worker ${worker.process.pid} died`);
//   });
// } else {
//   console.log(`Worker ${process.pid} started`);
//   app.listen(3001, () => {
//     console.log('Your node is running on port 3001');
//   });
// }

app.use(bodyParser.json());
//app.use('/api', router);
app.use(express.json());
app.use(cors());
app.use('/', expressStaticGzip(path.resolve(__dirname, '..', 'public')));

// Prevent "Cannot /GET /app/:gameid" on relevant frontend requests
app.get('/app/:gameid', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'public', 'index.html'));
});

app.get('/api/gamereviews/:gameid', async (req, res) => {
  let { gameid } = req.params;

  client.get(gameid, async (err, result) => {
    if (err) {
      console.log("CACHE ERROR REDIS RED ALERT RED ALERT");
      res.status(404);
    }
    if (result) {
      console.log("yo we got this cached");
      res.send(result);
    } else {
      try {
        console.log(gameid);
        console.log('Got data!')
        let fetchedData = await fetch(`http://3.15.142.19:4000/gamereviews/${gameid}`)
        let payload = await fetchedData.json();

        client.setex(gameid, 3600, JSON.stringify(payload));

        console.log(`cached ${gameid}`);

        res.status(200).json(payload);
      } catch(err) {
        console.error(err);
        res.status(500).json({ error: 'Error retrieving reviews' });
      }
    }
  })

})

let batch = [];

app.post('/api/create/:id_game', (req, res) => {
  let data = {
    ...req.params,
    ...req.body
  }

  let maxSize = 10;
  if (batch.length < maxSize) {
    batch.push(data);
    console.log(batch.length, ' current batch size..');
    res.send(201);
  }

  if (batch.length >= maxSize) {
    let temp = {data: batch};
    console.log('max size reached..posting...');
    batch = [];
    fetch(`http://3.15.142.19:4000/create/batch`, {
      method: 'post',
      body: JSON.stringify(temp),
      headers: { 'Content-Type': 'application/json' },
    })
    .then(response => {
      console.log("Success posting");
      res.status(201);
    })
    .catch(e => {
      console.error(e);
      res.status(500);
    })
  }

})
// router.get('/gamereviews/:gameid', async (req, res) => {
//   let { gameid } = req.params;
//   console.log(req.originalUrl)
//   if (parseInt(gameid) <= 0 || parseInt(gameid) > 30000) {
//     res.status(400).json({ error: 'Invalid game ID. Please use a number between 1 and 30000.' });
//     return;
//   }
//   try {

//     let payload = await getReviewsByGameIdWithUsersAndBadges(gameid, req.query);
//     console.log(payload.data.length);

//     let helpful;
//     let recent;
//     if ((req.query.display && req.query.display === 'summary') || !req.query.display) {
//       recent = payload.data.slice().sort((a, b) => Date.parse(a.date_posted) > Date.parse(b.date_posted) ? -1 : 1);
//       payload.recent = recent;
//     }
//     res.status(200).json(payload);

//   } catch (e) {
//     console.error(e);
//     res.status(500).json({ error: 'Error retrieving reviews' });
//   }
// });

// router.post('/create/:id_game', (req, res) => {
//   let options = {
//     ...req.params,
//     ...req.body
//   }
//   console.log("Inserting new reviews");
//   //console.log(options);
//   createNewReview(options).then((result) => {
//     console.log("Success!");
//     res.send(201);
//   }).catch(e => console.error(e));

// })

router.patch('/update/:id', (req, res) => {
  let options = {
    ...req.params,
    ...req.query
  }

  console.log(options);
  updateReviewById(options).then(result => {
    res.send(200);
  })
  .catch(e => {
    res.send(500);
  })
})

router.delete('/delete/:id', (req, res) => {
  let {id} = req.params;
  deleteReviewById(id).then(result => {
    res.send(200);
  })
  .catch(e => {
    console.error(e);
    res.send(500);
  })
})

const server = app.listen(process.env.PORT || 3001, () => {
  console.log(`Server listening on port ${process.env.PORT || 3001}`);
});

module.exports = { app, server };
