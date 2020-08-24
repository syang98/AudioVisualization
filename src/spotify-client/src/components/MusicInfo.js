import React, { Component } from '../../node_modules/react';
import Cookies from '../../node_modules/js-cookie';
import './MusicInfo.css';
//import P5Wrapper from 'react-p5-wrapper';

// import sketch from '../visuals/phyllotaxis-example/sketch'

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
      .then(response => {
        if (response.status === 401) {
          fetch('http://localhost:8888/refresh_token?refresh_token='+this.state.refresh_token)
            .then(response => response.json())
            .then(response => {
              this.setState({
                  access_token: response.access_token
                });
            }); 
        } else{
          return response
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
      .catch(error => console.log(error))
       
  }

  render() { return (
      
    <div>
      <div className='banner'>
        <h1 style={{verticalAlign: 'middle'}}>
          TODO: put in links for p5 sketches
        </h1>
      </div>
      <div className='background'></div>
      <div className='container'>
        <div>
          {this.state.nowPlaying.name}
        </div>
        <div>
          <img src= {this.state.nowPlaying.image} style={{ width: 200}}></img>
        </div>
      </div>
    </div>
      
    );
  }
}

