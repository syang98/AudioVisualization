// observing https://github.com/therewasaguy/p5-music-viz/blob/master/demos/08_echonestPitchSegment/sketch.js
// all this guy did was load an MP3 locally and add cues to his media object by using times from segements and sections
// this won't work here

// need to find a way to sync up my visual and the song playback
// first visual will be to : spin on section, expand radius/diameter on volume, change color on bars, kinda want spheres raining down
// based of kaleidoscope, it looks like he is using time stamps to when the song first starts, doing calculations to get close to audio features of the analysis
//      he has curr progress 
//      uses tatum to calculate beat
// based off currently player call, fetch track analysis
//          i think with the intervals, either choose segment or section and then random number in range of actual DB vol, to represent expanding the 
//              radius of the shape
//              try go straight of vol for now but he uses interpolation
//              need to figure out -5 > -60 need it so 5 > -5
//              maybe just adding a constant t then scaling accordingly is good enough

//   code is in his spotify.js file lines 306
//   code for beat calculation is in line 
//          if the goal is to change color on this, not sure how to do this rn
//          literally just change if the beat val is different? hmmmmm maybe

import React, { useRef, useEffect, Component } from 'react';
import rectangle from '../util/draw';
import './Visual.css'

export default class Visual extends Component {
    constructor(){
        super()
        this.canvasRef = React.createRef();
        this.tick = this.tick.bind(this);
        this.draw = this.draw.bind(this);
       

    }

    // shouldComponentUpdate(nextProps, nextStates){
    //     if (nextProps.color === this.props.color){
    //       return false
    //     }
    //     return true
    //   }
    componentDidMount() {
        this.interval = setInterval(() => this.tick(), 1000);
      }

    tick() {
        this.draw()    
    }

    draw(){
        const canvas = this.canvasRef.current;
        const context = canvas.getContext('2d');
        console.log(this.props.color+ "WHY");
        rectangle(250, 200, canvas, context);

    }

    render() {
        return (
          <div>
              FUCK THIS
            <canvas ref={this.canvasRef}/>
          </div>
        );
      }
}

