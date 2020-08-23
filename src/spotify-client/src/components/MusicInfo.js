import React, { Component } from '../../node_modules/react';
import Cookies from '../../node_modules/js-cookie';
import './MusicInfo.css';

export default class MusicInfo extends Component{
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
      .catch(response => {
        if (response.status === 401) {
          fetch('http://localhost:8888/refresh_token')
            .then(response => {
              this.setState({
                nowPlaying: {
                  access_token: response.access_token
                }
              });
            });
        }
      })
      .then(response => response.json())
      .then(response => {
        if (response.is_playing) {
          this.setState({
            nowPlaying: {
              name: response.item.name,
              image: response.item.album.images[0].url
            }
          });
        } else {
          this.setState({
            nowPlaying: {
              name: "Not playing any music",
              image: " "
            }
          });
        } 
      })
      .catch(e => console.log(e));  
  }

  render() { return (
    <body>
      <div className='banner'>
        <h1 style={{verticalAlign: 'middle'}}>
          TODO: put in links for p5 sketches
        </h1>
      </div>
      <div className='container'>
        <div>
          Currently playing: {this.state.nowPlaying.name}
        </div>
        <div>
          <img src= {this.state.nowPlaying.image} style={{ width: 175}}></img>
        </div>
      </div>
    </body>
      
    );
  }
}

