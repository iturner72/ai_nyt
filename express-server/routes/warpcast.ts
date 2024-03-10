const router = require('express').Router();
const axios = require('axios');

const WARPCAST_URL = process.env.WARPCAST_URL;

router.get('/', (req, res) => {
  res.send('Warpcast endpoint');
});

router.get('/channels', (req, res) => {
  axios.get(`${WARPCAST_URL}all-channels`)
    .then((r) => {
      res.send(r.data)
    })
    .catch((e) => {
      res.send(e)
    }
  );
});


module.exports = router;