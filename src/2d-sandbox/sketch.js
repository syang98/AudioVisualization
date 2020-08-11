let mic;
let smoothing = 0.8;
let binCount = 128;
let fractals = new Array(binCount);
let fractalDepth = 3;

function setup() {
    createCanvas(windowWidth, windowHeight);
    mic = new p5.AudioIn();
    mic.start();
    fft = new p5.FFT(smoothing, binCount);
    fft.setInput(mic);

    for (let i=0; i < binCount; i++){
        let x = map(i, 0, binCount, 0, width);
        let y = random(0, height);
        let position = createVector(x, y);
        fractals[i] = new fractal(position);
    }
}

function draw() {
    background(0);
    fft.analyze(binCount);
    let bass, lowMid, mid, highMid, treble;

    bass = fft.getEnergy('bass');
    lowMid = fft.getEnergy('lowMid');
    mid = fft.getEnergy('mid');
    highMid = fft.getEnergy('highMid');
    treble = fft.getEnergy('treble');

    let bin = [bass, lowMid, mid, highMid, treble];

    for (let i=0; i<binCount; i++) {
        shuffle(bin);
        let first = bin[0];
        let second = bin[1];
        fractals[i].update(first, second);
        fractals[i].draw();
    }

}

var fractal = function(position) {
    this.position = position;
    this.color = color(random(0,255), random(0,255), random(0,255));
    this.speed = createVector(random(0,5), random(0,5));
};


fractal.prototype.update = function(sound1, sound2) {
    this.radius1 = sound1*0.45;
    this.radius2 = sound2*0.45;


    // this.position.x += this.speed.x + 1/sound1;
    //
    // if (this.position.x > width) {
    //     this.position.x = random(0, width);
    // }

    this.position.y += this.speed.y + 1/sound2;

    if (this.position.y > height) {
        this.position.y = random(0, height);
    }



};

fractal.prototype.draw = function(depth) {
    fill(this.color);
    rect(
        this.position.x,
        this.position.y,
        this.radius1,
        this.radius2,
    );


};




