
// mostly a sandbox for playing around with WEBGL
let fft;
let smoothing = 0.8;
let binCount = 64;
let mic;
let peakdetect;

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    mic = new p5.AudioIn();
    mic.start();
    fft = new p5.FFT(smoothing, binCount);
    fft.setInput(mic);
    peakdetect = new p5.PeakDetect();

}
function draw() {
    background(255);
    let spectrum = fft.analyze(binCount);
    peakdetect.update(fft);

    let bass, lowMid, mid, highMid, treble;

    bass = fft.getEnergy('bass');
    lowMid = fft.getEnergy('lowMid');
    mid = fft.getEnergy('mid');
    highMid = fft.getEnergy('highMid');
    treble = fft.getEnergy('treble');

    let bin = [bass, lowMid, mid, highMid, treble];

    let rad = millis() / 1000;
    // Set rotation angles
    let ct = cos(rad);
    let st = sin(rad);
    // Matrix for rotation around the Y axis
    applyMatrix(  ct, 0.0,  st,  0.0,
                0.0, 1.0, 0.0,  0.0,
                -st, 0.0,  ct,  0.0,
                0.0, 0.0, 0.0,  1.0);
    // noFill();
    // box(bass, bass);



    // spectrum.forEach( (i)=>{
    //     let co = color(random(0,255), random(0,255), random(0,255));
    //
    //     //sphere(spectrum[i]);
    //     let rad = millis() / 1000;
    //     // Set rotation angles
    //     let ct = cos(rad);
    //     let st = sin(rad);
    //     // Matrix for rotation around the Y axis
    //     applyMatrix(  ct, 0.0,  st,  0.0,
    //                 0.0, 1.0, 0.0,  0.0,
    //                 -st, 0.0,  ct,  0.0,
    //                 0.0, 0.0, 0.0,  1.0);
    //     noStroke();
    //     sphere(spectrum[i]);
    //     fill(co);
    //     rotateZ(millis() / 1000);
    // });


}

function touchStarted() {
    getAudioContext().resume()
}



