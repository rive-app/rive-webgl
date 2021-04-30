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
        gl.stencilMask(0xFF);


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
                // We don't need to actually check the transform because it's
                // always world space and it won't change for the path instance.
                if (cA.path !== cB.path) {
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

        gl.enable(gl.STENCIL_TEST);
        gl.colorMask(false, false, false, false);
        gl.stencilFunc(gl.ALWAYS, 0x0, 0xFF);

        // Let's erase any clips that are no longer in the mask
        gl.stencilOp(gl.KEEP, gl.KEEP, gl.DECR);

        // Figure out which paths need to be removed from clip.
        const alreadyApplied = new Set();

        // TODO: Gotta fix up this nonesense by letting the rive-cpp artboard
        // draw method take an argument for whether to clip the artboard or not.
        let first = true;
        for (const {
                path: appliedPath,
                transform
            } of appliedClips) {
            if (first) {
                first = false;
                if (!_clipArtboard) {
                    continue;
                }
            }
            let remove = true;
            for (let i = 0; i < clipPaths.length; i++) {
                const {
                    path
                } = clipPaths[i];
                if (appliedPath === path) {
                    // This path is still in the clipping set so don't remove it.
                    remove = false;
                    alreadyApplied.add(path);
                    break;
                }
            }
            if (remove) {
                // Delete it from the clipping region (we set DECR in stencilOp).
                appliedPath.drawMesh(this, transform, programInfo);
            }
        }

        // Now increment as we add to the clip mask.
        gl.stencilOp(gl.KEEP, gl.KEEP, gl.INCR);
        first = true;
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

            if (alreadyApplied.has(path)) {
                // This clip was previously applied and is still in our set.
                continue;
            }

            path.drawMesh(this, transform, programInfo);

        }

        if (clipPaths.length > (_clipArtboard ? 0 : 1)) {
            gl.stencilFunc(gl.EQUAL, clipPaths.length - (_clipArtboard ? 0 : 1), 0xFF);
            gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
            this.isClipping = true;
        } else {
            gl.disable(gl.STENCIL_TEST);
            this.isClipping = false;
        }

        gl.colorMask(true, true, true, true);

        this.appliedClips = clipPaths.slice();
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