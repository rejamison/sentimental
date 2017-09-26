var process = require('process');
var chalk = require('chalk');
var OPC = require('./opc');

var FRAME_RATE = 8;
var client = new OPC('sentimental.local', 7890);

function hsvToRgb(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return new RGB(Math.round(r * 255), Math.round(g * 255), Math.round(b * 255));
}

function RGB(r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;
}

function Canvas() {
    this.buffer = [
        [new RGB(255,255,255),new RGB(255,255,255),new RGB(255,255,255),new RGB(255,255,255),new RGB(255,255,255),new RGB(255,255,255),new RGB(255,255,255),new RGB(255,255,255)],
        [new RGB(255,255,255),new RGB(255,255,255),new RGB(255,255,255),new RGB(255,255,255),new RGB(255,255,255),new RGB(255,255,255),new RGB(255,255,255),new RGB(255,255,255)],
        [new RGB(255,255,255),new RGB(255,255,255),new RGB(255,255,255),new RGB(255,255,255),new RGB(255,255,255),new RGB(255,255,255),new RGB(255,255,255),new RGB(255,255,255)]
    ];

    this.animationIndex = 0;
    this.height = this.buffer.length;
    this.width = this.buffer[0].length;
    this.shouldConsole = false;
    this.shouldFadeCandy = false;
    this.animations = [];

    this.initialize = function(renderToConsole, renderToFadeCandy) {
        console.log('Width: ' + this.width);
        console.log('Height: ' + this.height);
        this.shouldConsole = renderToConsole ? true : false;
        this.shouldFadeCandy = renderToFadeCandy ? true : false;

        if(this.shouldConsole) {
            // spit out some newlines for rendering to the console
            for(var x = 0; x < this.height; x++) {
                process.stdout.write('\n');
            }
        }

        this.animations.push(new Random());             // 0    0x00
        this.animations.push(new Collider());           // 1    0x01
        this.animations.push(new PulsingPixels());      // 2    0x02
        this.animations.push(new RotatingRainbow());    // 3    0x03
        this.animations.push(new Equalizer());          // 4    0x04
        this.animations.push(new GrowingLine());        // 5    0x05
        this.animations.push(new RacingDot());          // 6    0x06
        this.animations.push(new RacingLine());         // 7    0x07
        this.animations.push(new Rain());               // 10   0x0A
        this.animations.push(new Fireworks());          // 11   0x0B
        this.animations.push(new Off());                // 13   0x0D

        this.animations[this.animationIndex].initialize(this);
    };

    this.switchToAnimation = function(index) {
        if(index >= 0 && index < this.animations.length) {
            this.animationIndex = index;
            this.animations[this.animationIndex].initialize(this);
        } else {
            // do nothing
        }
    };

    this.run = function() {
        this.oneFrame();
    };

    this.pushToConsole = function() {
        var out = process.stdout;
        var rowCount = this.height;

        out.moveCursor(0,-rowCount);
        for(var y = 0; y < this.height; y++) {
            out.clearLine();
            for(var x = 0; x < this.width; x++) {
                out.write(chalk.bgRgb(this.buffer[y][x].r, this.buffer[y][x].g, this.buffer[y][x].b)('  '));
            }
            out.write('\n');
        }
    };

    this.pushToFadeCandy = function() {
        var xOffset = 4;  // rotate the x axis around to a specific position (i.e., back of the hat)
        for(var y = 0; y < this.height; y++) {
            for(var x = 0; x < this.width; x++) {
                var xTrans = x + xOffset;
                if(xTrans >= this.width) {
                    xTrans = xTrans - this.width;
                } else if(xTrans < 0) {
                    xTrans = this.width + xTrans;
                }
                client.setPixel((y * this.width) + xTrans + 1, this.buffer[y][x].g, this.buffer[y][x].r, this.buffer[y][x].b);
            }
        }
        client.writePixels();
    };

    this.fillBuffer = function(color) {
        for(var x = 0; x < this.buffer.length; x++) {
            for(var y = 0; y < this.buffer[x].length; y++) {
                this.buffer[x][y] = color;
            }
        }
    };

    this.drawPixel = function(x, y, color) {
        if(y >= 0 && y < this.height && x >= 0 && x < this.width) {
            this.buffer[y][x] = color;
        }
    };

    this.drawString = function(text, xOffset, yOffset, color) {
        for(var i = 0; i < text.length; i++) {
            var charCode = text.charCodeAt(i);
            if(charCode >= 65 && charCode <= 90) {
                charCode -= 65;
            } else if(charCode >= 97 && charCode <= 122) {
                charCode -= 97;
            } else {
                continue;
            }

            for(var x = 0; x < 6; x++) {
                for(var y = 0; y < this.height; y++) {
                    if(font[y][x + (charCode * 6)] != ' ') {
                        this.drawPixel(x + (i * 6) + xOffset, y + yOffset, color);
                    }
                }
            }
        }
    };

    this.drawStringRainbow = function(text, xOffset, yOffset) {
        for(var i = 0; i < text.length; i++) {
            var charCode = text.charCodeAt(i);
            if(charCode >= 65 && charCode <= 90) {
                charCode -= 65;
            } else if(charCode >= 97 && charCode <= 122) {
                charCode -= 97;
            } else {
                continue;
            }

            for(var x = 0; x < 6; x++) {
                for(var y = 0; y < this.height; y++) {
                    if(font[y][x + (charCode * 6)] != ' ') {
                        var hue = i / 6;
                        hue = hue - Math.floor(hue);
                        this.drawPixel(x + (i * 6) + xOffset, y + yOffset, hsvToRgb(hue,1,1));
                    }
                }
            }
        }
    };

    this.drawSprite = function(frames, frameIndex, width, xOffset, yOffset, color) {
        var frameOffset = frameIndex * width;

        for(var x = 0; x < 6; x++) {
            for(var y = 0; y < this.height; y++) {
                if(frames[y][x + frameOffset] != ' ') {
                    this.drawPixel(x + xOffset, y + yOffset, color);
                }
            }
        }
    };

    this.oneFrame = function() {
        // update the animation
        this.animations[this.animationIndex].update(this);

        // draw the pixels
        if(this.shouldFadeCandy) {
            this.pushToFadeCandy();
        }
        if(this.shouldConsole) {
            this.pushToConsole();
        }

        var millisToNextFrame = (1000 / FRAME_RATE) - (Date.now() % (1000 / FRAME_RATE));
        setTimeout(this.oneFrame.bind(this), millisToNextFrame);
    };
}

var canvas = new Canvas();
if(process.argv[2]) {
    if(process.argv[2] === 'FadeCandy') {
        canvas.initialize(false, true);
    } else if(process.argv[2] === 'Console') {
        canvas.initialize(true, false);
    } else if(process.argv[2] === 'Both') {
        canvas.initialize(true, true);
    } else {
        console.log("ERROR: Unrecognized param: " + process.argv[2]);
    }
} else {
    // default to showing just on fade candy
    canvas.initialize(false, true);
}
if(process.argv[3]) {
    canvas.switchToAnimation(process.argv[3]);
}
canvas.run();

function Off() {

    this.initialize = function(canvas) {
        canvas.fillBuffer(new RGB(0,0,0));
    }

    this.update = function(canvas) {
        // do nothing
    }
}

function Random() {
    this.FRAME_LIMIT = 150;
    this.currentAnimation;
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
    }

    this.update = function(canvas) {
        if((this.frameCounter % this.FRAME_LIMIT) === 0) {
            this.currentAnimation = this.animations[Math.floor(Math.random() * this.animations.length)]
            this.currentAnimation.initialize(canvas);
        }

        this.currentAnimation.update(canvas);
        this.frameCounter++;
    }
}

function PulsingPixels() {
    this.TTL = 16;
    this.pixels = [];

    this.initialize = function(canvas) {

    }

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
            canvas.drawPixel(p.x, p.y, hsvToRgb(p.h, p.s, p.v));
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

    this.initialize = function(canvas) {

    }

    this.update = function(canvas) {
        for(var y = 0; y < canvas.height; y++) {
            for(var x = 0; x < canvas.width; x++) {
                var hue = ((y + x) / 16) + (this.counter / 16);
                canvas.drawPixel(x, y, hsvToRgb(hue, 1, 1));
            }
        }
        this.counter++;
    }
}

function GrowingLine() {
    this.counter = 0;

    this.initialize = function(canvas) {
        canvas.fillBuffer(new RGB(0,0,0));
    }

    this.update = function(canvas) {
        if(this.counter >= (canvas.height * canvas.width)) {
            canvas.fillBuffer(new RGB(0,0,0));
            this.counter = 0;
        }
        canvas.drawPixel(this.counter % canvas.width, Math.floor(this.counter / canvas.width), new RGB(0,0,255));
        this.counter++;
    }
}

function RacingDot() {
    this.counter = 0;

    this.initialize = function(canvas) {
        canvas.fillBuffer(new RGB(0,0,0));
    }

    this.update = function(canvas) {
        canvas.fillBuffer(new RGB(0,0,0));
        canvas.drawPixel(this.counter % canvas.width, Math.floor(this.counter / canvas.width), new RGB(255,0,0));
        this.counter++;
        if(this.counter >= (canvas.height * canvas.width)) {
            this.counter = 0;
        }
    }
}

function RacingLine() {
    this.counter = 0;

    this.initialize = function(canvas) {
        canvas.fillBuffer(new RGB(0,0,0));
    }

    this.update = function(canvas) {
        canvas.fillBuffer(new RGB(0,0,0));
        for(var y = 0; y < canvas.height; y++) {
            canvas.drawPixel(this.counter % canvas.width, y, new RGB(255,0,0));
        }
        this.counter++;
        if(this.counter >= canvas.width) {
            this.counter = 0;
        }
    }
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
                canvas.drawPixel(x, canvas.height - y + 1, hsvToRgb(bar.h, 1, y / canvas.height));
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

    this.initialize = function(canvas) {

    }

    this.update = function(canvas) {
        if(this.pixels.length < 25) {
            var count = Math.floor(Math.random() * 3);
            for(var i = 0; i < count; i++) {
                this.pixels.push({
                    h: this.hue,
                    x: Math.floor(Math.random() * 16),
                    y: 0
                });
                this.hue += .02;
            }
        }

        canvas.fillBuffer(new RGB(0,0,0));

        for(var i = 0; i < this.pixels.length; i++) {
            var p = this.pixels[i];
            canvas.drawPixel(p.x, p.y, hsvToRgb(p.h, 1, ((p.y + 1) / (canvas.height * 2)) + .5));
            p.y++;
            if(p.y >= canvas.height) {
                this.pixels.splice(i, 1);
                i--;
            }
        }
    }
}

function Collider() {
    this.partA;
    this.partB;
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
    }

    this.update = function(canvas) {
        canvas.fillBuffer(new RGB(0,0,0));
        canvas.drawPixel(this.partA.x, this.partA.y, hsvToRgb(this.partA.h, 0, 1));
        canvas.drawPixel(this.partB.x, this.partB.y, hsvToRgb(this.partB.h, 0, 1));

        for(var i = 0; i < this.sparks.length; i++) {
            var spark = this.sparks[i];
            canvas.drawPixel(Math.round(spark.x), Math.round(spark.y), hsvToRgb(spark.h, 1, spark.ttl / 7));
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
            for(var i = 0; i < this.sparks.length; i++) {
                var spark = this.sparks[i];
                spark.x += spark.deltaX;
                spark.y += spark.deltaY;
                spark.ttl--;

                if(spark.ttl <= 0) {
                    this.sparks.splice(i, 1);
                    i--;
                }
            }
        }
    }
}

function Fireworks() {
    this.sparks = [];

    this.initialize = function(canvas) {

    }

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
            canvas.drawPixel(Math.round(spark.x), Math.round(spark.y), hsvToRgb(spark.h, 1, spark.ttl / spark.life));
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
    }
}

