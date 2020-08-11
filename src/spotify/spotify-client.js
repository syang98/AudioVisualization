const SpotifyToken = "BQCSUScNPOxSywzpIxLAAoTYtFg8sWXkiHg4gsaMvIzn2p9j4VMl0dPGIRU7uDqX34gs2vMq_LkV6QA7WEVPHT14EUnSMnHB6d9XLmvP_3XMjq20p7RjEqELzNbj_ozNzH-jTq-wgKskVwOJE-gzQZy3MPiHkQyq"

window.onSpotifyWebPlaybackSDKReady = () => {
    const token = SpotifyToken;
    const player = new Spotify.Player({
      name: 'Steve Yang Spotify Player for Music Visualization',
      getOAuthToken: cb => { cb(token); }
    });
  
    // Error handling
    player.addListener('initialization_error', ({ message }) => { console.error(message); });
    player.addListener('authentication_error', ({ message }) => { console.error(message); });
    player.addListener('account_error', ({ message }) => { console.error(message); });
    player.addListener('playback_error', ({ message }) => { console.error(message); });
  
    // Playback status updates
    player.addListener('player_state_changed', state => { console.log(state); });
  
    // Ready
    player.addListener('ready', ({ device_id }) => {
      console.log('Ready with Device ID', device_id);
    });
  
    // Not Ready
    player.addListener('not_ready', ({ device_id }) => {
      console.log('Device ID has gone offline', device_id);
    });
  
    // Connect to the player!
    player.connect();
  };