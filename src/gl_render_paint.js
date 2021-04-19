import * as twgl from 'twgl.js';

function colorToBuffer(value) {
    return new Float32Array([colorRed(value) / 0xFF, colorGreen(value) / 0xFF, colorBlue(value) / 0xFF,
        colorAlpha(value) / 0xFF
    ]);
}


function colorRed(value) {
    return (0x00ff0000 & value) >> 16;
}

function colorGreen(value) {
    return (0x0000ff00 & value) >> 8;
}

function colorBlue(value) {
    return (0x000000ff & value) >> 0;
}

function colorAlpha(value) {
    // stupid way to cast to uint8 since JS does bitwise ops as signed integers.
    return new Uint8Array([(0xff000000 & value) >> 24])[0];
}


function lerpChannel(a, b, mix) {
    return Math.round(a * (1.0 - mix) + b * mix);
}

class SolidColor {
    constructor(renderer, color) {
        this.color = color;
        this.programInfo = renderer.solidColorProgram;
    }
    bind(renderer) {
        const {
            gl
        } = renderer;
        const {
            programInfo,
            color
        } = this;
        gl.useProgram(programInfo.program);
        twgl.setUniforms(programInfo, {
            color: colorToBuffer(color)
        });
    }
}

class RadialGradient {
    constructor(builder, renderer, color) {
        this.color = color;
        this.programInfo = renderer.radialGradientProgram;
        this.builder = builder;
        this.buildTexture(renderer, builder);
    }

    updateGradient(renderer, builder) {
        // Check if stops are identical, don't update texture.
        const lastBuilder = this.builder;
        if (lastBuilder._stops.length != builder._stops.length) {
            // Lengths differ, don't bother checking rest, just update the texture.
            this.buildTexture(renderer, builder);
        } else {
            const stopsFrom = lastBuilder._stops;
            const stopsTo = builder._stops;
            const length = stopsFrom.length;
            // Check individual stop and color values, if any aren't the same, update the texture.
            for (let i = 0; i < length; i++) {
                if (stopsFrom[i].color != stopsTo[i].color || stopsFrom[i].stop != stopsTo[i].stop) {
                    this.buildTexture(renderer, builder);
                    break;
                }
            }
        }
        this.builder = builder;
    }

    buildTexture(renderer, builder) {
        const {
            gl
        } = renderer;
        const buffer = [];
        // For now just build a gradient of a fixed size, later optimize the
        // trivial 2 stop one at 0 and one at 1 case as 1x2 texture.

        const idealSize = 128;
        let consumed = 0;

        // assumes stops are in order.
        let lastStop = 0;
        let lastR = null,
            lastG, lastB, lastA;
        for (let {
                color,
                stop
            } of builder._stops) {

            const pixels = Math.min(idealSize - consumed, Math.round((stop - lastStop) * idealSize));
            let r = colorRed(color);
            let g = colorGreen(color);
            let b = colorBlue(color);
            let a = colorAlpha(color);
            if (lastR === null) {
                for (let i = 0; i < pixels; i++) {
                    buffer.push(r, g, b, a);
                }
            } else {
                for (let i = 0; i < pixels; i++) {

                    const f = i / pixels;
                    buffer.push(lerpChannel(lastR, r, f), lerpChannel(lastG, g, f), lerpChannel(lastB, b, f), lerpChannel(lastA, a, f));
                }
            }
            lastR = r;
            lastG = g;
            lastB = b;
            lastA = a;
            lastStop = stop;
            consumed += pixels;
        }
        const textures = twgl.createTextures(gl, {
            // a 1x2 pixel texture from a typed array.
            gradient: {
                mag: gl.LINEAR,
                min: gl.LINEAR,
                format: gl.RGBA,
                src: new Uint8Array(buffer),
                wrap: gl.CLAMP_TO_EDGE,
                width: 1,
            },
        });
        this.texture = textures.gradient;
    }

    bind(renderer) {
        const {
            gl
        } = renderer;
        const {
            programInfo,
            color
        } = this;
        gl.useProgram(programInfo.program);
        twgl.setUniforms(programInfo, {
            start: [this.builder._sx, this.builder._sy],
            end: [this.builder._ex, this.builder._ey],
            color: colorToBuffer(color),
            gradient: this.texture,
        });
    }
}

class GradientBuilder {
    constructor(sx, sy, ex, ey) {
        this._sx = sx;
        this._sy = sy;
        this._ex = ex;
        this._ey = ey;
        this._stops = [];
    }

    addStop(color, stop) {
        this._stops.push({
            color,
            stop
        });
    }
}

class LinearGradientBuilder extends GradientBuilder {

}

class RadialGradientBuilder extends GradientBuilder {
    makePainter(renderer, color) {
        return new RadialGradient(this, renderer, color);
    }
}

export default {
    __construct() {
        this._color = 0xFFFFFFFF;
        this.__parent.__construct.call(this);
    },
    color: function (value) {
        this._color = value;
    },
    thickness: function (value) {},
    join: function (value) {},
    cap: function (value) {},
    style: function (value) {},
    blendMode: function (value) {},
    linearGradient: function (sx, sy, ex, ey) {
        this._gradientBuilder = new LinearGradientBuilder(sx, sy, ex, ey);
    },
    radialGradient: function (sx, sy, ex, ey) {
        this._gradientBuilder = new RadialGradientBuilder(sx, sy, ex, ey);
    },
    addStop: function (color, stop) {
        this._gradientBuilder.addStop(color, stop);
    },

    completeGradient: function () {
        this._painter = null;
    },

    draw: function (renderer, path) {
        const {
            _transform
        } = renderer;

        let {
            _painter
        } = this;
        if (!_painter) {
            // Figure out which program we should be using.
            if (this._gradientBuilder) {
                _painter = this._gradientBuilder.makePainter(renderer, this._color);
                this._gradientBuilder = null;
            } else {
                _painter = new SolidColor(renderer, this._color);
            }
            this._painter = _painter;
        } else if (this._gradientBuilder) {
            // Update the gradient, this works as we don't allow changing paint
            // type once created. We optimize for this so we don't regenerate
            // textures if we don't need to.
            _painter.updateGradient(renderer, this._gradientBuilder);
        }
        _painter.color = this._color;
        this._painter.bind(renderer);

        path.cover(renderer, _transform, this._painter.programInfo);
    }
}