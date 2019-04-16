var fs = require('fs');

module.exports = () => {
  var data = fs.readFileSync(__dirname + '/average-latitude-longitude-countries.csv')
      .toString()
      .split('\n')
      .map(e => e.trim())
      .map(e => e.split(',').map(e => e.trim()));
  
  return data;
}
