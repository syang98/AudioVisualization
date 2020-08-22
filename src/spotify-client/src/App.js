import React, { Component } from 'react';
import Cookies from 'js-cookie';
import './App.css';

class App extends Component{
  constructor() {
    super();
    this.state = {
      access_token: Cookies.get('access_token'), 
      refresh_token: Cookies.get('refresh_token'),
      nowPlaying: {
          name: 'Not playing any music',
          image: " "
      }
    }
    this.tick = this.tick.bind(this); 
    this.getPlayState = this.getPlayState.bind(this); 
  }

  shouldComponentUpdate(nextProps, nextStates){
    if (nextStates.nowPlaying.name === this.state.nowPlaying.name){
      return false
    }
    this.getPlayState();
    return true
  }

  componentDidMount() {
    this.interval = setInterval(() => this.tick(), 2000);
  }

  tick() {
    this.getPlayState();
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  // TODO: worry about pausing playback, and states to none later
  //       would literally just be check if it's playing
  /**
   * make an API call to spotify to fetch data about currently playing song and set state to render
   */
  getPlayState() {
    var options = {
      method: 'GET',
      headers: {
        Authorization: "Bearer "+this.state.access_token,

      }
    }
    fetch('https://api.spotify.com/v1/me/player/currently-playing', options)
      .then(response => response.json())
      .then(response => {
        this.setState({
          nowPlaying: {
            name: response.item.name,
            image: response.item.album.images[0].url
          }
        })
      })
                          //.then(response => [response.item.name, response.item.album.images[0].url])
      .catch(e => ["Error", " "]);  
  }

  render() { return (
      <div className="App">
        <a href='http://localhost:8888/login'>
           <button>Login to Spotify</button>
        </a>
        <div>
          Currently playing: {this.state.nowPlaying.name}
        </div>
        <div>
          <img src= {this.state.nowPlaying.image} style={{ width: 150}}></img>
        </div>
      </div>
    );
  }
}

export default App;
