// following https://github.com/spotify/web-api-auth-examples/blob/master/authorization_code/app.js 

let config = require('./config');
let express = require('express');
let cors = require('cors');
let querystring = require('querystring');
let cookieParser = require('cookie-parser');
let fetch = require('node-fetch');

var client_id = config.id; 
var client_secret = config.secret; 
var redirect_uri = config.uri; 

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
app.use(cors())
   .use(cookieParser());

app.get('/login', function(req, res) {
  var state = generateRandomString(16);
  res.cookie(stateKey, state);
  var scope = 'user-read-private user-read-playback-state user-modify-playback-state';
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
    
    // TODO: for now keep as is, but once things are getting ready for something beyond local development
    //       use localStorage solution with html page with tokens, ok for now
    //       will require some research to figure out registering domains/deployment ok with this for now 
    //       look into this: https://github.com/JMPerez/passport-spotify
    res.cookie('access_token', response.access_token);
    res.cookie('refresh_token',response.refresh_token);
    res.redirect('http://localhost:3000/');
  }
});


app.get('/refresh_token', async function(req, res) {
  console.log("refreshing access token");
  var refresh_token = req.query.refresh_token;
  var authParams = new URLSearchParams();
  authParams.append('grant_type', 'refresh_token');
  authParams.append('refresh_token', refresh_token);
  var authOptions = {
    headers: { 'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64')) },
    body: authParams,
    mode: 'cors',
    method: 'POST'
  };

  var response = await fetch('https://accounts.spotify.com/api/token', authOptions)
                  .then(result => result.json())
                  .catch(e => "server-side error"+ console.log(e));
  var new_token = response.access_token;
  res.send({
    'access_token': new_token
  });
});

console.log('Listening on 8888');
app.listen(8888);


