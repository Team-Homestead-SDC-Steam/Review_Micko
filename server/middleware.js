const express = require('express');
const { createNewReview, updateReviewById, deleteReviewById} = require('../db/index');

const router = express.Router();


router.post('/create/:gameid', (req, res) => {
  let options = req.params;

  createNewReview.then(result => {
    console.log(result);
    res.send(200);
  })
  .catch(e => {
    res.send(500);
  })

})

router.put('/update/:gameid', (req, res) => {
  let {id, option} = req.params;

  updateReviewById(id, option).then(result => {
    console.log(result);
    res.send(200);
  })
  .catch(e => {
    res.send(500);
  })
})

router.delete('/delete/:gameid', (req, res) => {
  let {id} = req.params;
  deleteReviewById(id).then(result => {
    console.log(result);
    res.send(200);
  })
  .catch(e => {
    console.error(e);
    res.send(500);
  })
})