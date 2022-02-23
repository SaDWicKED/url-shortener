function generateHash(str) {
  return require('crypto').createHash('md5').update(str).digest("hex");
}

module.exports = {
  generateHash,  
}