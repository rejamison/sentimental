var process = require('process');
var VoiceEngine = require('./voiceengine');
var Canvas = require('./ledcanvas');
var log = require('winston');

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
ve.start();
