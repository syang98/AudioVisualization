// using the authorization code work flow for the Spotify API done in the backend
// following https://github.com/spotify/web-api-auth-examples/blob/master/authorization_code/app.js 

let config = require('./config');
let express = require('express');
let cors = require('cors');
let querystring = require('querystring');
let cookieParser = require('cookie-parser');
let request = require('request');
let fetch = require('node-fetch');

var client_id = config.id; // Your client id
var client_secret = config.secret; // Your secret
var redirect_uri = config.uri; // Your redirect uri

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var stateKey = 'spotify_auth_state';

var app = express();

app.use(express.static(__dirname + '/public'))
   .use(cors())
   .use(cookieParser());

app.get('/login', function(req, res) {

  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  var scope = 'user-read-private user-read-email';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
});

app.get('/callback', async function(req, res) {

  // your application requests refresh and access tokens
  // after checking the state parameter

  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);

    var params = new URLSearchParams();
    params.append("code", code);
    params.append("redirect_uri", redirect_uri);
    params.append('grant_type', 'authorization_code')
   
    var options = {
      url: 'https://accounts.spotify.com/api/token',
      body: params,
      headers: {
        'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
      },
      method: "POST",
      mode: 'cors',
    };

    var response = await fetch('https://accounts.spotify.com/api/token', options)
        .then(data => data.json())
        .catch(e => res.redirect(('/#' +
                    querystring.stringify({
                    error: 'invalid_token'
                    }))))
    
    var access_token = response.access_token;
    var refresh_token = response.refresh_token;

    var getOptions = {
        headers: { 'Authorization': 'Bearer ' + access_token }
    };

    var apiResponse = await fetch('https://api.spotify.com/v1/me', getOptions)
            .then(result => result.json())
            .then(result  => console.log(result))

    res.redirect('/#' + 
        querystring.stringify({
        access_token: access_token,
        refresh_token: refresh_token
    }));
  }
});

app.get('/refresh_token', function(req, res) {

  // requesting access token from refresh token
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      res.send({
        'access_token': access_token
      });
    }
  });
});

console.log('Listening on 8888');
app.listen(8888);





