var fs = require('fs');
console.log("FUCK")
var obj = JSON.parse(fs.readFileSync('C:/Users/Steven Yang/desktop/AudioVisualization/src/spotify-client/analysis.json', 'utf8'));
console.log(obj)