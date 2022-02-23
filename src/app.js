const path = require('path');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const { saveUrl, getUrl } = require('./models/urls.model');

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/', (req, res) => {
  return res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
});

// short url endpoint
app.post('/api/shorturl', async (req, res) => {
  const savedUrl = await saveUrl(req.body.url);
  return res.json({original_url: savedUrl.original_url, short_url: savedUrl.short_url});
});

app.get('/api/shorturl/:hash', async (req, res) => {
  const urlObj = await getUrl(req.params.hash);
  if(urlObj) {
    return res.status(301).redirect(urlObj.original_url);
  }
  return res.status(404).json({error: 'url not found'});
});

module.exports = app;