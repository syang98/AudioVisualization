
// the idea is to use a phyllotaxis algorithm to draw stuff change color on the beat
// tesseract to change color to the beat would be cool
let fft;
let smoothing = 0.8;
let binCount = 128;
let mic;
let c = 20;
let threshold = 2400;
let angles = [137.5, 137.3, 137.4, 137.6];
let start = 0;
let totalBass = 0;
let iterations = 0;
let iterationThreshold = 1400;
const cpuTolerance = 4800;

function setup() {
    createCanvas(windowWidth, windowHeight);
    angleMode(DEGREES);
    mic = new p5.AudioIn();
    mic.start();
    fft = new p5.FFT(smoothing, binCount);
    fft.setInput(mic);
    colorMode(HSB);
}
function draw() {
    background(0);
    fft.analyze(binCount);
    let bass = fft.getEnergy('bass');
    let lowMid = fft.getEnergy('lowMid');
    let mid = fft.getEnergy('mid');
    let highMid = fft.getEnergy('highMid');
    let treble = fft.getEnergy('treble');

    let angle = (iterations % iterationThreshold) ? angles[0] : angles[1];
    translate(width / 2, height / 2);
    let rotation = (iterations % iterationThreshold) ? -threshold*0.2 : threshold*0.2;
    rotate(rotation);

    // continue to play around with these settings
    let level = 0.5*bass+0.15*lowMid+0.25*mid+.075*highMid+.075*treble;

    for (let n = 0; n < threshold; n++){
        let phi = n * angle;
        let r = c * sqrt(n);
        let x = r * cos(phi);
        let y = r * sin(phi);
        let hu = cos(n * 0.6 + start);
        hu = map(hu, -1, 1, 0, 360);
        fill(hu, 255, 255);
        noStroke();
        rect(x, y, max(4, level*0.15), max(4, level*0.15));
    }
    iterations += 1;
    totalBass += level;

    let intensity = (totalBass/iterations) * 0.08;

    if (threshold > cpuTolerance) {
        threshold = 10;
    }
    threshold += min(intensity, 10);
    start += min(intensity, 10);
}

function touchStarted() {
    getAudioContext().resume()
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

function togglePlay() {
    if (sound.isPlaying()) {
      sound.pause();
    } else {
      sound.loop();
    }
}





