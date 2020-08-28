import React, { Component } from 'react';
import Cookies from 'js-cookie';
import './MusicInfo.css';
//import {msToSec} from  '../util/conversions';
import Visual from './Visual'


export default class MusicInfo extends Component{
  constructor() {
    super();
    this.state = {
      access_token: Cookies.get('access_token'), 
      refresh_token: Cookies.get('refresh_token'),
      nowPlaying: {
          name: 'Not playing any music',
          image: " ",
          id: " ",
          isPlaying: false,
          progress: ' '
      }
    }
    this.songData = ''
    this.tick = this.tick.bind(this); 
    this.getPlayState = this.getPlayState.bind(this); 
    this.getMusicAnalysis = this.getMusicAnalysis.bind(this);
    this.onBeat = this.onBeat.bind(this);
    this.getBeatInterval = this.getBeatInterval.bind(this);
    this.colors = ["orange", 'red', 'blue', 'green', 'yellow']
    this.color = this.colors[0];
    this.p5ref = React.createRef();
  }

  

  shouldComponentUpdate(nextProps, nextStates){
    if (nextStates.nowPlaying.name === this.state.nowPlaying.name){
      return false
    }
    return true
  }

  componentDidMount() {
    this.interval = setInterval(() => this.tick(), 1000);
  }


  componentDidUpdate(prevProps, prevState){
    if (prevState.nowPlaying.name !== this.state.nowPlaying.name && this.state.nowPlaying.name !== "Not playing any music"){
      this.getMusicAnalysis();
      if (this.songData !== ''){
        console.log("TIMESTAMP: "+this.songData.meta.timestamp)
        console.log("BARS: "+this.songData.bars.length)
        console.log("BEATS: "+this.songData.beats.length)
        console.log("SEGMENTS: "+this.songData.segments.length)
        console.log("SECTIONS: "+this.songData.sections.length)
        console.log("TATUMS : "+this.songData.tatums.length)
      }
    }
  }

  tick() {
    this.getPlayState();
    //this.onBeat();
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }


  /**
   * make API call to spotify to get music analysis json object for visualizer
   */
  getMusicAnalysis() {
    var options = {
      method: 'GET',
      headers: {
        Authorization: "Bearer "+this.state.access_token,
      }
    }
    if (this.state.nowPlaying.id !== " "){
      fetch("https://api.spotify.com/v1/audio-analysis/"+this.state.nowPlaying.id, options)
        .then(response => {
          if (response.status === 404) {
            throw new Error("No analysis for this song from spotify")
          } else {
            return response
          }
        })
        .then(response => response.json())
        .then(response => this.songData = response)
        .catch(e => console.log(e))
    }
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
              image: response.item.album.images[0].url,
              id: response.item.id,
              isPlaying: response.is_playing, 
              progress: response.progress_ms
            }
          });
        } else {
          this.setState({
            nowPlaying: {
              name: "Not playing any music",
              image: " ",
              id: ' ',
              isPlaying: false,
              progress: " "
            }
          });
        } 
      })
      .catch(error => {console.log(error)
        this.setState({
          nowPlaying: {
            name: "Not playing any music",
            image: " ",
            id: ' ',
            isPlaying: false,
            progress: " "
          }
        })
      })      
  }

  onBeat() {
    this.color = this.colors[this.getBeatInterval()%this.colors.length]
  }

  getBeatInterval() {
    if (this.songData !== '' && this.state.nowPlaying.name !== "Not playing any music"){
      var currentTime = Math.ceil(this.state.nowPlaying.progress/1000);
      for (let i = 0; i< this.songData.beats.length; i++){
        var start = this.songData.beats[i].start;
        var end = this.songData.beats[i].duration + start;
        var confidence = this.songData.beats[i].confidence;
        if (start <= currentTime <=end && confidence >= 0.05){
          return i
        }
      }
    } else {
      console.log("No song data")
    }
  }


  render() { return (
      
    <div>
      <div className='banner'>
        <h1 style={{verticalAlign: 'middle'}}>
          TODO: insert a rectangle that changes color on the beat
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

