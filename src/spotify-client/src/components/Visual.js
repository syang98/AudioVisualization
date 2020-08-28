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

import React, { useRef, useEffect, Component } from 'react'
import rectangle from '../util/draw'

export default class Visual extends Component {
    constructor(){
        super()
        this.canvasRef = React.createRef();
        this.tick = this.tick.bind(this);
        this.draw = this.draw.bind(this);

    }
    componentDidMount() {
        
        this.interval = setInterval(() => this.tick(), 1000);
      }

    tick() {
        this.draw()
        
    }

    draw(){
        const canvas = this.canvasRef.current;
        const context = canvas.getContext('2d');
        rectangle(100, 100, canvas, context);

    }

    render() {
        return (
          <div>
            <canvas ref={this.canvasRef} />
          </div>
        );
      }
}

// const Visual = props => {
  
//   const canvasRef = useRef(null)
  
//   const draw = ctx => {
//     ctx.fillStyle = '#000000'
//     ctx.beginPath()
//     ctx.arc(50, 100, 20, 0, 2*Math.PI)
//     ctx.fill()
//   }
  
//   useEffect(() => {
    
//     const canvas = canvasRef.current
//     const context = canvas.getContext('2d')
    
//     //Our draw come here
//     draw(context)
//   }, [draw])
  
//   return <canvas ref={canvasRef} {...props}/>
// }

// export default Visual