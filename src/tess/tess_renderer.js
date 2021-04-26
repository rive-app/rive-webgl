import * as twgl from 'twgl.js';
import m2d from '../m2d.js';

export default {
    __construct(canvas, clipArtboard, contourError) {
        this.contourError = contourError;
        this._clipArtboard = clipArtboard;
        this.__parent.__construct.call(this);
        let gl = canvas.getContext('webgl', {
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

        // Setup simple program
        this.programInfo = twgl.createProgramInfo(gl, [
            `
  attribute vec2 position;
  uniform mat4 projection;
  uniform mat4 transform;
  varying vec2 pos;
  
  void main(void) {
    gl_Position = projection*transform*vec4(position, 0.0, 1.0);
    pos = position;
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
            programInfo
        } = this;

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

        gl.disable(gl.DEPTH_TEST);
        gl.disable(gl.CULL_FACE);

        gl.enable(gl.STENCIL_TEST);

        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
        gl.useProgram(programInfo.program);
        twgl.setUniforms(programInfo, {
            projection: this.projection,
            fillType: 0,
            color: [0, 0, 0, 1],
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

        const {
            programInfo,
        } = this;


        // Go and applied clipping paths.

        if (clipPaths.length > (_clipArtboard ? 0 : 1)) {
            let first = true;
            gl.enable(gl.STENCIL_TEST);

            gl.colorMask(false, false, false, false);
            gl.clear(gl.STENCIL_BUFFER_BIT);
            gl.stencilMask(0xFF);
            gl.stencilFunc(gl.ALWAYS, 0x0, 0xFF);
            gl.stencilOp(gl.KEEP, gl.KEEP, gl.INCR);


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
                path.drawMesh(this, transform, programInfo);
            }

            this.appliedClips = clipPaths.slice();
            // Further drawing will only pass if it matches the total clipping
            // shapes drawn.
            gl.stencilFunc(gl.EQUAL, this.appliedClips.length - (_clipArtboard ? 0 : 1), 0xFF);
            gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
            gl.colorMask(true, true, true, true);

            this.isClipping = true;
        } else {
            gl.disable(gl.STENCIL_TEST);
            this.isClipping = false;
        }




        // // Setup further rendering after applying the clip.
        // if (this.isClipping) {
        //     gl.enable(gl.STENCIL_TEST);
        //     // Pass only if that 8th bit is set. This allows us to write our new
        //     // winding into the lower 7 bits.
        //     gl.stencilFunc(gl.EQUAL, this.appliedClips.length, 0xFF);

        // } else {
        //     // No need to use the stencil test if there's no clipping
        //     gl.disable(gl.STENCIL_TEST);
        // }

        // gl.colorMask(true, true, true, true);

        // gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
    },

    _applyClipPath(path, transform) {
        const {
            gl,
            programInfo,
        } = this;
        path.drawMesh(this, transform, programInfo);
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