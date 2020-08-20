
// essentially a copy of
let mic;
let song;

let fft;
let smoothing = 0.8;
let binCount = 1024;
let particle = new Array(binCount);


function preload() {
    song = loadSound("song.mp3");
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    song.play();
    mic = new p5.AudioIn();
    mic.start();

    fft = new p5.FFT(smoothing, binCount);
    fft.setInput(mic);

    for (let i=0; i<particle.length; i++) {
        let x = map(i, 0, binCount, 0, width*2);
        let y = random(0, height);
        let position = createVector(x, y);
        particle[i] = new Particles(position);
    }



}
function draw() {
    background(0,0,0,100);
    let spectrum = fft.analyze(binCount);

    for (let i=0; i<binCount; i++) {
        var thisLevel = map(spectrum[i], 0, 255, 0, 1);
        particle[i].update(thisLevel);
        particle[i].draw();
        particle[i].position.x = map(i, 0, binCount, 0, width*2)
    }
}

function mousePressed() {
  userStartAudio();
}

var Particles = function(position) {
    this.position = position;
    this.scale = random(0, 1);
    this.speed = createVector(0, random(0,10));
    this.color = color(random(0,255), random(0,255), random(0,255));
};

Particles.prototype.update = function(someLevel) {
  this.position.y += this.speed.y / (someLevel*2);
  if (this.position.y > height) {
      this.position.y = 0;
  }
  this.diameter = map(someLevel, 0, 1, 0, 100)*this.scale;
};

Particles.prototype.draw = function() {
  fill(this.color);
  ellipse(
      this.position.x, this.position.y,
      this.diameter, this.diameter
  );
};

