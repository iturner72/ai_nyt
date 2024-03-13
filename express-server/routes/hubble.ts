const axios = require('axios');
const router = require('express').Router();
const HUBBLE_URL = process.env.HUBBLE_URL;

router.get('/', (req, res) => {
  res.send('Hubble endpoint');
});

router.get('/castsByChannel', (req, res) => {
  let {channel_url} = req.query;
  console.log(channel_url)
  axios.get(`${HUBBLE_URL}:2281/v1/castsByParent?url=${encodeURIComponent(channel_url)}`)
    .then((r) => {
      console.log('data', r.data, r.request.path)
      res.send(r.data)
    })
    .catch((e) => {
      console.log(e)
      res.send(e)
      }
    );
});

module.exports = router;