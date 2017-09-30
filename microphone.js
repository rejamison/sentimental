const record = require('node-record-lpcm16');
const snowboy = require('snowboy');
const Speaker = require('speaker');
const Stream = require('stream');
const AWS = require('aws-sdk');
const log = require('winston');

log.level = 'debug';

var MODE_SLEEPING = 0;
var MODE_AWAKE = 1;

function VoiceEngine() {
    this.detector = null;
    this.models = null;
    this.mic = null;
    this.utteranceBuffers = [];
    this.mode = MODE_SLEEPING;
    this.silenceCount = 0;
    this.lastHotword = null;
}
VoiceEngine.prototype.start = function () {
    this.models = new snowboy.Models();

    this.models.add({
        file: 'res/snowboy.umdl',
        sensitivity: '0.5',
        hotwords: 'snowboy'
    });
    this.models.add({
        file: 'res/alexa.umdl',
        sensitivity: '0.5',
        hotwords: 'alexa'
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
        log.debug('heard silence');
        this.silenceCount++;

        if(this.silenceCount > 10) {
            log.debug('done listening after ' + this.lastHotword);

            if(this.lastHotword === 'alexa') {
                // var speaker = new Speaker({
                //     channels: 1,
                //     bitDepth: 16,
                //     sampleRate: 16000,
                //     signed: true
                // });
                // var stream = new Stream.PassThrough();
                // stream.end(utteranceBuffer);
                // stream.pipe(speaker);
            } else if(this.lastHotword === 'snowboy') {
                var utteranceBuffer = Buffer.concat(this.utteranceBuffers);
                var lex = new AWS.LexRuntime({region: 'us-east-1'});
                lex.postContent({
                    botAlias: 'prod',
                    botName: 'Sentimental',
                    contentType: 'audio/l16; rate=16000; channels=1',
                    inputStream: utteranceBuffer,
                    userId: 'ME',
                    accept: 'text/plain; charset=utf-8'
                }, function(err, data) {
                    if(err) {
                        log.error("ERROR: " + err);
                    } else {
                        log.info(JSON.stringify(data));
                    }
                });
            }

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
        log.debug('heard voices')
        this.utteranceBuffers.push(buffer);
    } else if(this.mode === MODE_SLEEPING) {
        // do nothing
    }
}
VoiceEngine.prototype.onHotword = function (index, hotword, buffer) {
    if(this.mode === MODE_AWAKE) {
        // do nothing
    } else if(this.mode === MODE_SLEEPING) {
        log.info('heard ' + hotword + ', starting listening');
        this.utteranceBuffers.push(buffer);
        this.mode = MODE_AWAKE;
        this.lastHotword = hotword;
    }
}
VoiceEngine.prototype.onError = function(err) {
    log.error(err);
}

var ve = new VoiceEngine();
ve.start();