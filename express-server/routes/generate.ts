const router = express.Router();
const axios = require('axios');

const OPENAI_URL = process.env.OPENAI_URL || 'https://api.openai.com/v1/';

router.get('/', (req, res) => {
  res.send('OpenAI endpoint');
});

router.get('/summary', (req, res) => {
  res.send('OpenAI summary endpoint');
});


module.exports = router;