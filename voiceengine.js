const record = require('node-record-lpcm16');
const snowboy = require('snowboy');
//const Speaker = require('speaker');
const Stream = require('stream');
const AWS = require('aws-sdk');
const log = require('winston');

log.level = 'debug';

var MODE_SLEEPING = 0;
var MODE_AWAKE = 1;

var LISTEN_LIMIT = 10;
var SILENCE_LIMIT = 7;

function VoiceEngine() {
    this.detector = null;
    this.models = null;
    this.mic = null;
    this.utteranceBuffers = [];
    this.mode = MODE_SLEEPING;
    this.silenceCount = 0;
    this.listenCount = 0;
    this.lastHotword = null;
    this.intentHandlers = {};
    this.readStream = null;
    this.lex = null;
    this.onWakeUpHandlers = {};
    this.onSleepHandlers = {};
}
VoiceEngine.prototype.addIntentHandler = function(intentName, handler) {
    this.intentHandlers[intentName] = handler;
};
VoiceEngine.prototype.addOnWakeUpHandler = function(hotword, handler) {
    this.onWakeUpHandlers[hotword] = handler;
};
VoiceEngine.prototype.addOnSleepHandler = function(hotword, handler) {
    this.onSleepHandlers[hotword] = handler;
};
VoiceEngine.prototype.start = function () {
    this.lex = new AWS.LexRuntime({region: 'us-east-1'});

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

};
VoiceEngine.prototype.onSilence = function () {
    if(this.mode === MODE_AWAKE) {
        log.debug('heard silence');
        this.silenceCount++;

        if(this.silenceCount > SILENCE_LIMIT) {
            log.debug('done listening after ' + this.lastHotword);

            if(this.lastHotword === 'alexa') {
                // var utteranceBuffer = Buffer.concat(this.utteranceBuffers);
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
                this.readStream.push(null);
            }

            this.silenceCount = 0;
            this.listenCount = 0;
            this.utteranceBuffers = [];
            this.mode = MODE_SLEEPING;
            if(this.onSleepHandlers[this.lastHotword]) {
                this.onSleepHandlers[this.lastHotword]();
            }
        }
    } else if(this.mode === MODE_SLEEPING) {
        // do nothing
    }
};
VoiceEngine.prototype.onSound = function (buffer) {
    if(this.mode === MODE_AWAKE) {
        log.debug('heard voices (' + this.listenCount + ")");
        this.readStream.push(buffer);
        this.utteranceBuffers.push(buffer);

        this.listenCount++;
        if(this.listenCount > LISTEN_LIMIT) {
          log.debug('done listening after ' + this.lastHotword);

            if(this.lastHotword === 'alexa') {
                // var utteranceBuffer = Buffer.concat(this.utteranceBuffers);
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
                this.readStream.push(null);
            }

            this.silenceCount = 0;
            this.listenCount = 0;
            this.utteranceBuffers = [];
            this.mode = MODE_SLEEPING;
            if(this.onSleepHandlers[this.lastHotword]) {
                this.onSleepHandlers[this.lastHotword]();
            }  
        }
    } else if(this.mode === MODE_SLEEPING) {
        // do nothing
    }
};
VoiceEngine.prototype.onHotword = function (index, hotword, buffer) {
    if(this.mode === MODE_AWAKE) {
        // do nothing
    } else if(this.mode === MODE_SLEEPING) {
        log.info('heard ' + hotword + ', starting listening');
        this.mode = MODE_AWAKE;
        this.lastHotword = hotword;
        this.readStream = new Stream.Readable();
        this.readStream._read = function() {};
        this.readStream.push(buffer);
        this.utteranceBuffers.push(buffer);
        if(this.onWakeUpHandlers[this.lastHotword]) {
            this.onWakeUpHandlers[this.lastHotword]();
        }

        var that = this;
        this.lex.postContent({
            botAlias: 'prod',
            botName: 'Sentimental',
            contentType: 'audio/l16; rate=16000; channels=1',
            inputStream: this.readStream,
            userId: 'ME',
            accept: 'text/plain; charset=utf-8'
        }, function(err, data) {
            if(err) {
                log.error("ERROR: " + err);
            } else {
                log.info(JSON.stringify(data));
                if(data.intentName in that.intentHandlers) {
                    that.intentHandlers[data.intentName](data.slots);
                } else {
                    log.debug("No intent handler found for: " + data.intentName)
                }
            }
        });
    }
};
VoiceEngine.prototype.onError = function(err) {
    log.error(err);
};

module.exports = VoiceEngine;
