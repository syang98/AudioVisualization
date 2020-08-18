const http = require('http');
const config = require('./config');
function apiCall(options) {
    return new Promise((resolve, reject) => {
        var req = http.request(options, (res) => {
            var body = [];
            res.on('data', (chunk) => {
                body.push(chunk)
            });
            res.on('end', () => {
                try {
                    body = JSON.parse(Buffer.concat(body).toString());
                } catch(e) {
                    reject(e);
                }
                resolve(body);
            });
        });
        req.on('error', (err) => {
            console.error(err);
            reject(err);
        });
        req.end();
    });
}

module.exports = {apiCall}