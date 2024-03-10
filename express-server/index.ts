const express = require('express');
require('dotenv').config();
const cors = require('cors');
const app = express();

const PORT = process.env.PORT || 8080;
const whitelist = ['http://localhost:3000', 'http://localhost:3001']

const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

app.use(cors(corsOptions));
app.get('/', (req, res) => {
  res.send('Greetings from the express server!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const hubbleRouter = require('./routes/hubble.ts');
app.use('/hubble', hubbleRouter)

const warpcastRouter = require('./routes/warpcast.ts');
app.use('/warpcast', warpcastRouter)