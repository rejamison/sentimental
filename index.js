var process = require('process');
var VoiceEngine = require('./voiceengine');
var Canvas = require('./ledcanvas');
var log = require('winston');
var RGB = require('./rgb')

var shouldFadeCandy = true;
var shouldConsole = false;
if(process.argv[2]) {
    if(process.argv[2] === 'FadeCandy') {
        shouldFadeCandy = true;
        shouldConsole = false;
    } else if(process.argv[2] === 'Console') {
        shouldFadeCandy = false;
        shouldConsole = true;
    } else if(process.argv[2] === 'Both') {
        shouldFadeCandy = true;
        shouldConsole = true;
    } else {
        log.error("Unrecognized param: " + process.argv[2]);
    }
}

var canvas = new Canvas('sentimental.local', 7890, shouldConsole, shouldFadeCandy);
if(process.argv[3]) {
    canvas.switchToAnimation(process.argv[3]);
}
canvas.initialize();
canvas.run();

var ve = new VoiceEngine();
ve.addIntentHandler('ShowMeIntent', function(slots) {
    if(slots.animationName) {
        log.debug("Switching canvas animation to: " + slots.animationName);
        canvas.switchToAnimation(slots.animationName);
    }
});
ve.addOnWakeUpHandler('snowboy', function() {
    canvas.setAnimation(new SnowboyWakeUpAnimation());
});
ve.addOnSleepHandler('snowboy', function() {
    canvas.setAnimation(canvas.animations.Off);
});
ve.addOnWakeUpHandler('alexa', function() {
    canvas.setAnimation(new AlexaWakeUpAnimation());
});
ve.addOnSleepHandler('alexa', function() {
    canvas.setAnimation(canvas.animations.Off);
});
ve.start();

function SnowboyWakeUpAnimation() {
    this.counter = 0;

    this.initialize = function(canvas) {
        canvas.fillBuffer(new RGB(0,0,0));
    };

    this.update = function(canvas) {
        canvas.fillBuffer(new RGB(0,0,0));
        for(var x = 0; x < this.counter; x++) {
            for(var y = 0; y < canvas.height; y++) {
                canvas.drawPixel(x, y, RGB.fromHSV(0,0,1));
                canvas.drawPixel(canvas.width - x - 1, y, RGB.fromHSV(0,0,1));
            }
        }
        if(this.counter < canvas.width - this.counter - 1) {
            this.counter++;
        }
    };
}

function AlexaWakeUpAnimation() {
    this.counter = 0;

    this.initialize = function(canvas) {
        canvas.fillBuffer(new RGB(0,0,0));
    };

    this.update = function(canvas) {
        canvas.fillBuffer(new RGB(0,0,0));
        for(var x = 0; x < this.counter; x++) {
            for(var y = 0; y < canvas.height; y++) {
                canvas.drawPixel(x, y, RGB.fromHSV(2/3,1,1));
                canvas.drawPixel(canvas.width - x - 1, y, RGB.fromHSV(2/3,1,1));
            }
        }
        if(this.counter < canvas.width - this.counter - 1) {
            this.counter++;
        }
    };
}