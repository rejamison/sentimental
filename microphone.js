var record = require('node-record-lpcm16');
var snowboy = require('snowboy');

var MODE_SLEEPING = 0;
var MODE_AWAKE = 1;

function VoiceEngine() {
    this.detector = null;
    this.models = null;
    this.mic = null;
    this.utteranceBuffers = [];
    this.mode = MODE_SLEEPING;
    this.silenceCount = 0;
}
VoiceEngine.prototype.initialize = function () {
    this.models = new snowboy.Models();

    this.models.add({
        file: 'res/snowboy.umdl',
        sensitivity: '0.5',
        hotwords: 'snowboy'
    });

    this.detector = new snowboy.Detector({
        resource: "res/common.res",
        models: this.models,
        audioGain: 2.0
    });

    this.detector.on('silence', this.onSilence.bind(this));
    this.detector.on('sound', this.onSound.bind(this));
    this.detector.on('error', this.onError.bind(this));
    this.detector.on('hotword', this.onHotword.bind(this));
    this.detector.on('silence', this.onSilence.bind(this));

    this.mic = record.start({
        threshold: 0
    });

    this.mic.pipe(this.detector);

}
VoiceEngine.prototype.onSilence = function () {
    if(this.mode === MODE_AWAKE) {
        console.log('heard silence')
        this.silenceCount++;

        if(this.silenceCount > 10) {
            console.log('done listening');
            this.silenceCount = 0;
            this.utteranceBuffers = [];
            this.mode = MODE_SLEEPING;
        }
    } else if(this.mode === MODE_SLEEPING) {
        // do nothing
    }
}
VoiceEngine.prototype.onSound = function (buffer) {
    if(this.mode === MODE_AWAKE) {
        console.log('heard voices')
        this.utteranceBuffers.push(buffer);
    } else if(this.mode === MODE_SLEEPING) {
        // do nothing
    }
}
VoiceEngine.prototype.onHotword = function (index, hotword, buffer) {
    if(this.mode === MODE_AWAKE) {
        // do nothing
    } else if(this.mode === MODE_SLEEPING) {
        console.log('starting listening');
        this.utteranceBuffers.push(buffer);
        this.mode = MODE_AWAKE;
    }
}
VoiceEngine.prototype.onError = function () {
    console.log('error');
}

var ve = new VoiceEngine();
ve.initialize();