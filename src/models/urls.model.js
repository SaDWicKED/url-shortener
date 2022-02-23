const urlsDatabase = require('./urls.mongo');
const { generateHash } = require('../services/utils');

async function saveUrl(url) {
  try {
    const hash = generateHash(url).slice(0,8);
    
    const existsUrl = await urlsDatabase.findOne({
      original_url: url,
    });

    // if url doesn't exist in database
    if (!existsUrl) {
      const isHashDuplicated = await urlsDatabase.findOne({
        short_url: hash,
      });

      // manage hash collition (TODO optimize in the future)
      while(isHashDuplicated) {
        hash = generateHash(hash).slice(0,8);
        isHashDuplicated = await urlsDatabase.findOne({
          short_url: hash,
        });
      }
     
      const savedUrl = await (new urlsDatabase({
        original_url: url,
        short_url: hash,
      })).save();

      return savedUrl;
    } else {
      return existsUrl;
    }
  } catch (error) {
    console.error(error);
  }
}

async function getUrl(short_url) {
  try {
    return await urlsDatabase.findOne({
      short_url
    });
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  saveUrl,
  getUrl
}