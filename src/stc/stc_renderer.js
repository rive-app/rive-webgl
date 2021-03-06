import * as twgl from 'twgl.js';
import m2d from '../m2d.js';

export default {
    __construct(canvas, clipArtboard, contourError) {
        this.contourError = contourError;
        this._clipArtboard = clipArtboard;
        this.__parent.__construct.call(this);
        let gl = canvas.getContext('webgl', {
            powerPreference: 'high-performance',
            preserveDrawingBuffer: true,
            alpha: true,
            stencil: true,
            antialias: true,
            premultipliedAlpha: false,
        });
        this.gl = gl;
        this._transform = m2d.init();
        this.stack = [];
        this.clipPaths = [];
        this.appliedClips = [];
        this.isClippingDirty = false;

        this.clearScreenProgramInfo = twgl.createProgramInfo(gl, [
            `
  attribute vec2 position;
  
  void main(void) {
    gl_Position = vec4(position, 0.0, 1.0);
  }`,
            `
  precision highp float;
  
  void main() {
    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
  }`
        ]);

        this.screenBlitBuffer = twgl.createBufferInfoFromArrays(gl, {
            position: {
                numComponents: 2,
                data: [-1, -1, 1, -1, 1, 1, -1, 1]
            },
            indices: {
                numComponents: 3,
                data: [0, 1, 2, 2, 3, 0]
            }
        });

        this.programInfo = twgl.createProgramInfo(gl, [
            `
  attribute vec2 position;
  uniform mat4 projection;
  uniform mat4 transform;
  uniform mat4 localTransform;
  varying vec2 pos;
  
  void main(void) {
    gl_Position = projection*transform*vec4(position, 0.0, 1.0);
    pos = (localTransform*vec4(position, 0.0, 1.0)).xy;
  }`,
            `
  precision highp float;
  uniform vec4 color;
  uniform vec2 start;
  uniform vec2 end;
  uniform int count;
  uniform vec4 colors[16];
  uniform float stops[16];
  uniform int fillType;

  varying vec2 pos;

  void main() 
  {
    if(fillType == 0) 
    {
        // solid
        gl_FragColor = vec4(color.rgb*color.a, color.a);
    }
    else if(fillType == 1)
    {
        // linear
        vec2 toEnd = end - start;
        float lengthSquared = toEnd.x*toEnd.x+toEnd.y*toEnd.y;
        float f = dot(pos - start, toEnd)/lengthSquared;

        gl_FragColor = mix(
            colors[0], 
            colors[1], 
            smoothstep( stops[0], stops[1], f ) 
        );
        for ( int i=1; i<15; ++i ) 
        {
            if(i >= count-1) 
            {
                break;
            }
            gl_FragColor = mix(
                                gl_FragColor, 
                                colors[i+1], 
                                smoothstep( stops[i], stops[i+1], f ) 
                            );
        }
        float alpha = gl_FragColor.w;
        gl_FragColor = vec4(gl_FragColor.xyz*alpha, alpha);
    }
    else if(fillType == 2) 
    {
        // radial
        float f = distance(start, pos)/distance(start, end);

        gl_FragColor = mix(
            colors[0], 
            colors[1], 
            smoothstep( stops[0], stops[1], f ) 
        );
        for ( int i=1; i<15; ++i ) 
        {
            if(i >= count-1) 
            {
                break;
            }
            gl_FragColor = mix(
                                gl_FragColor, 
                                colors[i+1], 
                                smoothstep( stops[i], stops[i+1], f ) 
                            );
        }
        float alpha = gl_FragColor.w;
        gl_FragColor = vec4(gl_FragColor.xyz*alpha, alpha);
    }
  }`
        ]);
    },
    save() {
        this.stack.push({
            transform: m2d.clone(this._transform),
            clipPaths: this.clipPaths.slice()
        });
    },
    restore() {
        const last = this.stack[this.stack.length - 1];
        this.stack.splice(this.stack.length - 1, 1);
        this._transform = last.transform;
        this.clipPaths = last.clipPaths;
        this.isClippingDirty = true;
    },
    transform(matrix) {
        m2d.mul(this._transform, this._transform, m2d.fromRive(matrix));
    },
    startFrame() {
        const {
            gl,
            programInfo,
        } = this;
        gl.useProgram(programInfo.program);
        gl.disable(gl.DEPTH_TEST);
        gl.disable(gl.CULL_FACE);

        gl.enable(gl.STENCIL_TEST);

        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

        this.appliedClips = [];
        this.isClippingDirty = false;
        this.projection = twgl.m4.ortho(
            0,
            gl.canvas.width,
            gl.canvas.height,
            0,
            0,
            1
        );

        twgl.setUniforms(programInfo, {
            projection: this.projection
        });
    },

    _applyClipping() {
        this.isClippingDirty = false;
        const {
            clipPaths,
            appliedClips
        } = this;

        let same = true;
        if (clipPaths.length == appliedClips.length) {
            for (let i = 0; i < clipPaths.length; i++) {
                const cA = clipPaths[i];
                const cB = appliedClips[i];
                if (cA.path != cB.path || !m2d.same(cA.transform, cB.transform)) {
                    same = false;
                    break;
                }
            }
        } else {
            same = false;
        }
        if (same) {
            return;
        }
        // Always clear the set clip
        const {
            gl,
            _clipArtboard,
        } = this;
        gl.enable(gl.STENCIL_TEST);
        gl.stencilMask(0xFF);
        gl.clear(gl.STENCIL_BUFFER_BIT);

        gl.colorMask(false, false, false, false);

        this.isClipping = false;

        // Go and applied clipping paths.
        if (clipPaths.length > (_clipArtboard ? 0 : 1)) {
            let first = true;
            for (const {
                    path,
                    transform
                } of clipPaths) {
                if (first) {
                    first = false;
                    if (!_clipArtboard) {
                        continue;
                    }
                }
                this._applyClipPath(path, transform);
            }
        }

        this.appliedClips = clipPaths.slice();
    },
    _applyClipPath(path, transform) {
        const {
            gl,
            programInfo,
            isClipping
        } = this;
        // gl.useProgram(programInfo.program);
        if (isClipping) {
            // When clipping we want to write only to the last/lower 7 bits as our high 8th bit is used to mark clipping inclusion.
            gl.stencilMask(0x7F);
            // Pass only if that 8th bit is set. This allows us to write our new winding into the lower 7 bits.
            gl.stencilFunc(gl.EQUAL, 0x80, 0x80);
        } else {
            gl.stencilMask(0xFF);
            gl.stencilFunc(gl.ALWAYS, 0x0, 0xFF);
        }

        gl.stencilOpSeparate(gl.FRONT, gl.KEEP, gl.KEEP, gl.INCR_WRAP);
        gl.stencilOpSeparate(gl.BACK, gl.KEEP, gl.KEEP, gl.DECR_WRAP);

        const isEvenOdd = path._fillRule && path._fillRule.value == 1; //rive.FillRule.evenOdd;
        if (!isEvenOdd) {
            gl.frontFace(gl.CCW);
        } else {
            // Will be set by paths individually...
        }
        path.stencil(this, transform, 0, isEvenOdd);

        // Fail when not equal to 0 and replace with 0x80 (mark high bit as included in clip). Require stencil mask (write mask) of 0xFF and stencil func mask of 0x7F such that the comparison looks for 0 but write 0x80.
        gl.stencilMask(0xFF);
        gl.stencilFunc(gl.NOTEQUAL, 0x80, 0x7F);
        gl.stencilOp(gl.ZERO, gl.ZERO, gl.REPLACE);
        if (isClipping) {
            // gl.clearStencil(0x80);
            // gl.clear(gl.STENCIL_BUFFER_BIT);
            // We were already clipping, we should "cover" the combined area of the previous clip and this one, for now we blit the whole frame buffer.
            const {
                clearScreenProgramInfo,
                screenBlitBuffer
            } = this;
            gl.useProgram(clearScreenProgramInfo.program);

            twgl.setBuffersAndAttributes(
                gl,
                clearScreenProgramInfo,
                screenBlitBuffer
            );

            twgl.drawBufferInfo(gl, screenBlitBuffer);
            gl.useProgram(programInfo.program);
        } else {
            path.cover(this, transform, programInfo);
        }

        // Let further ops know we're clipping.
        this.isClipping = true;
    },
    drawPath(path, paint) {

        // Don't draw strokes for now.
        if (paint._style.value != 1 || !paint.prepDraw(this)) {
            return;
        }
        if (this.isClippingDirty) {
            this._applyClipping();
        }
        const {
            gl,
            programInfo,
            isClipping
        } = this;

        // gl.useProgram(programInfo.program);

        if (isClipping) {
            // When clipping we want to write only to the last/lower 7 bits as our high 8th bit is used to mark clipping inclusion.
            gl.stencilMask(0x7F);
            // Pass only if that 8th bit is set. This allows us to write our new winding into the lower 7 bits.
            gl.stencilFunc(gl.EQUAL, 0x80, 0x80);
        } else {
            gl.stencilMask(0xFF);
            gl.stencilFunc(gl.ALWAYS, 0x0, 0xFF);
        }

        gl.colorMask(false, false, false, false);

        gl.stencilOpSeparate(gl.FRONT, gl.KEEP, gl.KEEP, gl.INCR_WRAP);
        gl.stencilOpSeparate(gl.BACK, gl.KEEP, gl.KEEP, gl.DECR_WRAP);

        const isEvenOdd = path._fillRule && path._fillRule.value == 1; //rive.FillRule.evenOdd;
        if (!isEvenOdd) {
            gl.frontFace(gl.CCW);
        } else {
            // Will be set by paths individually...
        }
        path.stencil(this, this._transform, 0, isEvenOdd);

        gl.colorMask(true, true, true, true);

        // If we're clipping, compare again only the lower 7 bits.
        gl.stencilFunc(gl.NOTEQUAL, 0, isClipping ? 0x7F : 0xFF);
        gl.stencilOp(gl.ZERO, gl.ZERO, gl.ZERO);
        paint.draw(this, path);
    },
    clipPath(path) {
        this.clipPaths.push({
            path,
            transform: m2d.clone(this._transform)
        });
        this.isClippingDirty = true;
    }
}