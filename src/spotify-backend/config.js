const envvars = require('dotenv');
envvars.config();
module.exports = {
    id:process.env.ID, 
    secret: process.env.SECRET, 
    uri: process.env.URI
}

