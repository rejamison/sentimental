var RGB = require('./rgb');
var OPC = require('./opc');
var log = require('winston');
var chalk = require('chalk');

function LEDCanvas(hostname, port, renderToConsole, renderToFadeCandy, frameRate) {
    this.buffer = [
        [new RGB(255, 255, 255), new RGB(255, 255, 255), new RGB(255, 255, 255), new RGB(255, 255, 255), new RGB(255, 255, 255), new RGB(255, 255, 255), new RGB(255, 255, 255), new RGB(255, 255, 255)],
        [new RGB(255, 255, 255), new RGB(255, 255, 255), new RGB(255, 255, 255), new RGB(255, 255, 255), new RGB(255, 255, 255), new RGB(255, 255, 255), new RGB(255, 255, 255), new RGB(255, 255, 255)],
        [new RGB(255, 255, 255), new RGB(255, 255, 255), new RGB(255, 255, 255), new RGB(255, 255, 255), new RGB(255, 255, 255), new RGB(255, 255, 255), new RGB(255, 255, 255), new RGB(255, 255, 255)]
    ];

    this.animation = null;
    this.height = this.buffer.length;
    this.width = this.buffer[0].length;
    this.shouldConsole = renderToConsole ? true : false;
    this.shouldFadeCandy = renderToFadeCandy ? true : false;
    this.animations = {};
    this.opcclient = new OPC(hostname, port);
    this.frameRate = frameRate ? frameRate : 12;
}

LEDCanvas.prototype.initialize = function() {
    log.debug('Width: ' + this.width);
    log.debug('Height: ' + this.height);

    if (this.shouldConsole) {
        // spit out some newlines for rendering to the console
        for (var x = 0; x < this.height; x++) {
            process.stdout.write('\n');
        }
    }

    this.animations.Random = new Random();
    this.animations.Collider = new Collider();
    this.animations.PulsingPixels = new PulsingPixels();
    this.animations.RotatingRainbow = new RotatingRainbow();
    this.animations.Equalizer = new Equalizer();
    this.animations.GrowingLine = new GrowingLine();
    this.animations.RacingDot = new RacingDot();
    this.animations.RacingLine = new RacingLine();
    this.animations.Rain = new Rain();
    this.animations.Fireworks = new Fireworks();
    this.animations.Off = new Off();

    this.animation = this.animations.Random;
    this.animation.initialize(this);
};

LEDCanvas.prototype.switchToAnimation = function (animationName) {
    if(animationName in this.animations) {
        this.animation = this.animations[animationName];
        this.animation.initialize(this);
    } else {
        log.debug("Couldn't find animation with name: " + animationName);
    }
};

LEDCanvas.prototype.setAnimation = function(animation) {
    this.animation = animation;
    if(this.animation) {
        this.animation.initialize(this);
    }
}

LEDCanvas.prototype.run = function () {
    this.oneFrame();
};

LEDCanvas.prototype.pushToConsole = function () {
    var out = process.stdout;
    var rowCount = this.height;

    out.moveCursor(0, -rowCount);
    for (var y = 0; y < this.height; y++) {
        out.clearLine();
        for (var x = 0; x < this.width; x++) {
            out.write(chalk.bgRgb(this.buffer[y][x].r, this.buffer[y][x].g, this.buffer[y][x].b)('  '));
        }
        out.write('\n');
    }
};

LEDCanvas.prototype.pushToFadeCandy = function () {
    var xOffset = 4;  // rotate the x axis around to a specific position (i.e., back of the hat)
    for (var y = 0; y < this.height; y++) {
        for (var x = 0; x < this.width; x++) {
            var xTrans = x + xOffset;
            if (xTrans >= this.width) {
                xTrans = xTrans - this.width;
            } else if (xTrans < 0) {
                xTrans = this.width + xTrans;
            }
            this.opcclient.setPixel((y * this.width) + xTrans + 1, this.buffer[y][x].g, this.buffer[y][x].r, this.buffer[y][x].b);
        }
    }
    this.opcclient.writePixels();
};

LEDCanvas.prototype.fillBuffer = function (color) {
    for (var x = 0; x < this.buffer.length; x++) {
        for (var y = 0; y < this.buffer[x].length; y++) {
            this.buffer[x][y] = color;
        }
    }
};

LEDCanvas.prototype.drawPixel = function (x, y, color) {
    if (y >= 0 && y < this.height && x >= 0 && x < this.width) {
        this.buffer[y][x] = color;
    }
};


LEDCanvas.prototype.drawSprite = function (frames, frameIndex, width, xOffset, yOffset, color) {
    var frameOffset = frameIndex * width;

    for (var x = 0; x < 6; x++) {
        for (var y = 0; y < this.height; y++) {
            if (frames[y][x + frameOffset] != ' ') {
                this.drawPixel(x + xOffset, y + yOffset, color);
            }
        }
    }
};

LEDCanvas.prototype.oneFrame = function () {
    // update the animation
    if(this.animation) {
        this.animation.update(this);
    }

    // draw the pixels
    if (this.shouldFadeCandy) {
        this.pushToFadeCandy();
    }
    if (this.shouldConsole) {
        this.pushToConsole();
    }

    var millisToNextFrame = (1000 / this.frameRate) - (Date.now() % (1000 / this.frameRate));
    setTimeout(this.oneFrame.bind(this), millisToNextFrame);
};

module.exports = LEDCanvas;

function Off() {

    this.initialize = function(canvas) {
        canvas.fillBuffer(new RGB(0,0,0));
    };

    this.update = function(canvas) {
        // do nothing
    };
}

function Random() {
    this.FRAME_LIMIT = 150;
    this.currentAnimation = null;
    this.animations = [];
    this.frameCounter = 0;

    this.initialize = function(canvas) {
        this.animations.push(new Collider());
        this.animations.push(new PulsingPixels());
        this.animations.push(new RotatingRainbow());
        this.animations.push(new Equalizer());
        //this.animations.push(new GrowingLine());
        //this.animations.push(new RacingDot());
        //this.animations.push(new RacingLine());
        this.animations.push(new Rain());
        this.animations.push(new Fireworks());
    };

    this.update = function(canvas) {
        if((this.frameCounter % this.FRAME_LIMIT) === 0) {
            this.currentAnimation = this.animations[Math.floor(Math.random() * this.animations.length)];
            this.currentAnimation.initialize(canvas);
        }

        this.currentAnimation.update(canvas);
        this.frameCounter++;
    }
}

function PulsingPixels() {
    this.TTL = 16;
    this.pixels = [];

    this.initialize = function(canvas) {};

    this.update = function(canvas) {
        if(this.pixels.length < 15) {
            this.pixels.push({
                ttl: this.TTL,
                h: Math.random(),
                s: 1,
                v: 0,
                x: Math.floor(Math.random() * 16),
                y: Math.floor(Math.random() * 6)
            });
        }

        canvas.fillBuffer(new RGB(0,0,0));

        for(var i = 0; i < this.pixels.length; i++) {
            var p = this.pixels[i];
            canvas.drawPixel(p.x, p.y, RGB.fromHSV(p.h, p.s, p.v));
            p.ttl--;
            var half_ttl = this.TTL / 2;
            if(p.ttl < half_ttl) {
                p.v = (p.ttl + 1) / half_ttl;
            } else {
                p.v = (this.TTL - p.ttl) / (this.TTL / 2);
            }
            if(p.ttl <= 0) {
                this.pixels.splice(i, 1);
                i--;
            }
        }
    }
}

function RotatingRainbow() {
    this.counter = 0;

    this.initialize = function(canvas) {};

    this.update = function(canvas) {
        for(var y = 0; y < canvas.height; y++) {
            for(var x = 0; x < canvas.width; x++) {
                var hue = ((y + x) / 16) + (this.counter / 16);
                canvas.drawPixel(x, y, RGB.fromHSV(hue, 1, 1));
            }
        }
        this.counter++;
    }
}

function GrowingLine() {
    this.counter = 0;

    this.initialize = function(canvas) {
        canvas.fillBuffer(new RGB(0,0,0));
    };

    this.update = function(canvas) {
        if(this.counter >= (canvas.height * canvas.width)) {
            canvas.fillBuffer(new RGB(0,0,0));
            this.counter = 0;
        }
        canvas.drawPixel(this.counter % canvas.width, Math.floor(this.counter / canvas.width), new RGB(0,0,255));
        this.counter++;
    };
}

function RacingDot() {
    this.counter = 0;

    this.initialize = function(canvas) {
        canvas.fillBuffer(new RGB(0,0,0));
    };

    this.update = function(canvas) {
        canvas.fillBuffer(new RGB(0,0,0));
        canvas.drawPixel(this.counter % canvas.width, Math.floor(this.counter / canvas.width), new RGB(255,0,0));
        this.counter++;
        if(this.counter >= (canvas.height * canvas.width)) {
            this.counter = 0;
        }
    };
}

function RacingLine() {
    this.counter = 0;

    this.initialize = function(canvas) {
        canvas.fillBuffer(new RGB(0,0,0));
    };

    this.update = function(canvas) {
        canvas.fillBuffer(new RGB(0,0,0));
        for(var y = 0; y < canvas.height; y++) {
            canvas.drawPixel(this.counter % canvas.width, y, new RGB(255,0,0));
        }
        this.counter++;
        if(this.counter >= canvas.width) {
            this.counter = 0;
        }
    };
}

function Equalizer() {
    this.counter = 0;
    this.bars = [];
    this.hue = 240 / 360;
    this.CYCLE_TIME = 6;
    this.direction = 1;

    this.initialize = function(canvas) {
        this.hue += 20 / 360;
        this.counter = 0;
        this.bars = [];
        for(var i = 0; i < canvas.width; i++) {
            this.bars.push({
                max: Math.floor((Math.random() * canvas.height) + 1),
                h: this.hue
            });
        }
    };

    this.update = function(canvas) {
        canvas.fillBuffer(new RGB(0,0,0));
        for(var x = 0; x < canvas.width; x++) {
            var bar = this.bars[x];
            var bar_height = Math.floor(((this.counter + 1) / this.CYCLE_TIME) * bar.max);
            for(var y = 0; y <= bar_height; y++) {
                canvas.drawPixel(x, canvas.height - y + 1, RGB.fromHSV(bar.h, 1, y / canvas.height));
            }
        }

        this.counter += this.direction;
        if(this.counter > this.CYCLE_TIME) {
            this.direction = -1;
        } else if(this.counter < 0) {
            this.initialize(canvas);
            this.direction = 1;
        }
    }
}

function Rain() {
    this.pixels = [];
    this.hue = 0;

    this.initialize = function(canvas) {};

    this.update = function(canvas) {
        var i = 0;
        if(this.pixels.length < 25) {
            var count = Math.floor(Math.random() * 3);
            for(i = 0; i < count; i++) {
                this.pixels.push({
                    h: this.hue,
                    x: Math.floor(Math.random() * 16),
                    y: 0
                });
                this.hue += .02;
            }
        }

        canvas.fillBuffer(new RGB(0,0,0));

        for(i = 0; i < this.pixels.length; i++) {
            var p = this.pixels[i];
            canvas.drawPixel(p.x, p.y, RGB.fromHSV(p.h, 1, ((p.y + 1) / (canvas.height * 2)) + .5));
            p.y++;
            if(p.y >= canvas.height) {
                this.pixels.splice(i, 1);
                i--;
            }
        }
    };
}

function Collider() {
    this.partA = null;
    this.partB = null;
    this.sparks = [];

    this.initialize = function(canvas) {
        this.partA = {
            x: 0,
            y: 0,
            h: Math.random()
        };
        this.partB = {
            x: canvas.width - 1,
            y: canvas.height - 1,
            h: Math.random()
        }
    };

    this.update = function(canvas) {
        var spark = null;
        canvas.fillBuffer(new RGB(0,0,0));
        canvas.drawPixel(this.partA.x, this.partA.y, RGB.fromHSV(this.partA.h, 0, 1));
        canvas.drawPixel(this.partB.x, this.partB.y, RGB.fromHSV(this.partB.h, 0, 1));

        for(var i = 0; i < this.sparks.length; i++) {
            spark = this.sparks[i];
            canvas.drawPixel(Math.round(spark.x), Math.round(spark.y), RGB.fromHSV(spark.h, 1, spark.ttl / 7));
        }

        if((this.partA.y === this.partB.y) && (Math.abs(this.partA.x - this.partB.x) <= 1)) {
            this.initialize(canvas);

            var hue = Math.random();
            for(var i = 0; i < 10; i++) {
                var sparkHue = hue + (Math.random() * .05) - .025;
                this.sparks.push({
                    x: (canvas.width / 2) + Math.floor(Math.random() * 3) - 1,
                    y: (canvas.height / 2) + Math.floor(Math.random() * 3) - 1,
                    h: sparkHue,
                    deltaX: (Math.random() * 2) - 1,
                    deltaY: (Math.random() * 2) - 1,
                    ttl: 7
                });
            }
        } else {
            this.partA.x++;
            if(this.partA.x >= canvas.width) {
                this.partA.x = 0;
                this.partA.y++;
            }
            this.partB.x--;
            if(this.partB.x < 0) {
                this.partB.x = canvas.width - 1;
                this.partB.y--;
            }
            for(i = 0; i < this.sparks.length; i++) {
                spark = this.sparks[i];
                spark.x += spark.deltaX;
                spark.y += spark.deltaY;
                spark.ttl--;

                if(spark.ttl <= 0) {
                    this.sparks.splice(i, 1);
                    i--;
                }
            }
        }
    };
}

function Fireworks() {
    this.sparks = [];

    this.initialize = function(canvas) {};

    this.update = function(canvas) {
        if(this.sparks.length < 5) {
            var hue = Math.random();
            var x = Math.floor(Math.random() * 14) + 1;
            for(var i = 0; i < 15; i++) {
                var life = 8 + Math.floor(Math.random() * 5) - 1;
                var sparkHue = hue + (Math.random() * .05) - .025;
                if(sparkHue >= 1) {
                    sparkHue -= 1;
                }
                if(sparkHue < 0) {
                    sparkHue += 1;
                }
                this.sparks.push({
                    x: x,
                    y: (canvas.height / 2) - 1,
                    h: sparkHue,
                    deltaX: Math.cos(Math.random() * 2 * 3.14159),
                    deltaY: Math.sin(Math.random() * 2 * 3.14159),
                    life: life,
                    ttl: life
                });
            }
        }
        canvas.fillBuffer(new RGB(0,0,0));

        for(var i = 0; i < this.sparks.length; i++) {
            var spark = this.sparks[i];
            canvas.drawPixel(Math.round(spark.x), Math.round(spark.y), RGB.fromHSV(spark.h, 1, spark.ttl / spark.life));
        }

        var hue = Math.random();
        for(var i = 0; i < this.sparks.length; i++) {
            var spark = this.sparks[i];
            spark.x += spark.deltaX;
            spark.y += spark.deltaY;
            spark.deltaY += .15;
            spark.ttl--;

            if(spark.ttl <= 0) {
                this.sparks.splice(i, 1);
                i--;
            }
        }
    };
}