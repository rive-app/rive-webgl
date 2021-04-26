import * as twgl from 'twgl.js';
import m2d from '../m2d.js';

let id = 0;
const PathCommand = {
    move: 0,
    line: 1,
    cubic: 2,
    close: 3
};
export default {
    __construct() {
        this._id = id++;
        this._commands = [];
        this.__parent.__construct.call(this);
        this._isDirty = true;
        this._isShapeDirty = true;
    },
    reset() {
        this._isDirty = true;
        this._isShapeDirty = true;
        this._commands = [];
        delete this._paths;
    },
    addPath(path, matrix) {
        if (!this._paths) {
            this._paths = [];
        }
        this._paths.push({
            p: path,
            m: m2d.fromRive(matrix)
        });
    },
    fillRule(fillRule) {
        this._fillRule = fillRule;
    },
    moveTo(x, y) {
        this._commands.push({
            c: PathCommand.move,
            x,
            y
        });
    },
    lineTo(x, y) {
        this._commands.push({
            c: PathCommand.line,
            x,
            y
        });
    },
    cubicTo(ox, oy, ix, iy, x, y) {
        this._commands.push({
            c: PathCommand.cubic,
            ox,
            oy,
            ix,
            iy,
            x,
            y
        });
    },
    close() {
        this._commands.push({
            c: PathCommand.close
        });
    },

    isContainer() {
        return this._paths.length != 0;
    },

    updateContour(renderer) {

        if (this._paths) {
            for (const {
                    p
                } of this._paths) {
                p.updateContour(renderer);
            }
            return;
        }
        const {
            gl
        } = renderer;
        if (this._isDirty) {
            const {
                contour,
                cover
            } = this.computeContour(renderer.contourError);

            const {
                contourBufferInfo,
                coverBufferInfo
            } = this;

            if (contourBufferInfo) {
                gl.deleteBuffer(contourBufferInfo.attribs.position.buffer);
                gl.deleteBuffer(contourBufferInfo.indices);
            }
            if (coverBufferInfo) {
                gl.deleteBuffer(coverBufferInfo.attribs.position.buffer);
                gl.deleteBuffer(coverBufferInfo.indices);
            }

            this.contourBufferInfo = twgl.createBufferInfoFromArrays(gl, contour);
            this.coverBufferInfo = twgl.createBufferInfoFromArrays(gl, cover);
        }
    },

    // Build the subdivided contour of the path. This should can be used as the
    // buffer for the fill and the guide for the stroke.
    computeContour(contourError) {
        const minSegmentLength = contourError * contourError;
        const distTooFar = contourError;

        this._isDirty = false;
        // Seed vertices with the "out of bounds" point which we'll update
        // later, this is the origin from which we'll draw our triangles that
        // have on edge on the contour.
        const vertices = [];

        // Store min/max points in order to compute the bounds for the cover.
        let minX = Number.MAX_VALUE,
            minY = Number.MAX_VALUE;
        let maxX = -Number.MAX_VALUE,
            maxY = -Number.MAX_VALUE;

        function addVertex(x, y) {
            vertices.push(x, y);
            if (x < minX) {
                minX = x;
            }
            if (y < minY) {
                minY = y;
            }
            if (x > maxX) {
                maxX = x;
            }
            if (y > maxY) {
                maxY = y;
            }
        }

        let penX = 0,
            penY = 0;
        let penDownX = 0,
            penDownY = 0;
        let isPenDown = false;

        function penDown() {
            if (isPenDown) {
                return;
            }
            isPenDown = true;
            penDownX = penX;
            penDownY = penY;
            addVertex(penX, penY);
        }

        function segmentCubic(fx, fy, ox, oy, ix, iy, x, y, t1, t2) {
            function lerp(a, b, f) {
                return a + f * (b - a);
            }

            function computeHull(fx, fy, fox, foy, tix, tiy, tx, ty, t) {
                const d1 = [
                    lerp(fx, fox, t),
                    lerp(fy, foy, t),

                    lerp(fox, tix, t),
                    lerp(foy, tiy, t),

                    lerp(tix, tx, t),
                    lerp(tiy, ty, t)
                ];

                const d2 = [
                    lerp(d1[0], d1[2], t),
                    lerp(d1[1], d1[3], t),

                    lerp(d1[2], d1[4], t),
                    lerp(d1[3], d1[5], t)
                ];

                return d1
                    .concat(d2)
                    .concat([lerp(d2[0], d2[2], t), lerp(d2[1], d2[3], t)]);
            }

            function tooFar(ax, ay, bx, by) {
                return Math.max(Math.abs(ax - bx), Math.abs(ay - by)) > distTooFar;
            }

            function cubicAt(t, a, b, c, d) {
                let ti = 1.0 - t;
                let value =
                    ti * ti * ti * a +
                    3.0 * ti * ti * t * b +
                    3.0 * ti * t * t * c +
                    t * t * t * d;
                return value;
            }

            function shouldSplitCubic(fx, fy, fox, foy, tix, tiy, tx, ty) {
                const oneThirdX = lerp(fx, tx, 1 / 3);
                const oneThirdY = lerp(fy, ty, 1 / 3);

                const twoThirdX = lerp(fx, tx, 2 / 3);
                const twoThirdY = lerp(fy, ty, 2 / 3);

                return (
                    tooFar(fox, foy, oneThirdX, oneThirdY) ||
                    tooFar(tix, tiy, twoThirdX, twoThirdY)
                );
            }

            if (shouldSplitCubic(fx, fy, ox, oy, ix, iy, x, y)) {
                let halfT = (t1 + t2) / 2;

                let hull = computeHull(fx, fy, ox, oy, ix, iy, x, y, 0.5);

                segmentCubic(
                    fx,
                    fy,
                    hull[0],
                    hull[1],
                    hull[6],
                    hull[7],
                    hull[10],
                    hull[11],
                    t1,
                    halfT
                );
                segmentCubic(
                    hull[10],
                    hull[11],
                    hull[8],
                    hull[9],
                    hull[4],
                    hull[5],
                    x,
                    y,
                    halfT,
                    t2
                );
            } else {
                const dx = fx - x;
                const dy = fy - y;

                const length = dx * dx + dy * dy;
                if (length > minSegmentLength) {
                    addVertex(cubicAt(t2, fx, ox, ix, x), cubicAt(t2, fy, oy, iy, y));
                }
            }
        }

        for (const command of this._commands) {
            switch (command.c) {
                case PathCommand.move:
                    penX = command.x;
                    penY = command.y;
                    break;
                case PathCommand.line:
                    penDown();
                    addVertex((penX = command.x), (penY = command.y));
                    break;
                case PathCommand.cubic:
                    penDown();
                    const {
                        ox, oy, ix, iy, x, y
                    } = command;

                    const size = vertices.length;
                    segmentCubic(penX, penY, ox, oy, ix, iy, x, y, 0.0, 1.0);
                    penX = x;
                    penY = y;
                    break;
                case PathCommand.close:
                    if (isPenDown) {
                        penX = penDownX;
                        penY = penDownY;
                        isPenDown = false;
                    }
                    break;
            }
        }

        this.contour = new Float32Array(vertices);

        // Update the arrays.
        return {
            contour: {
                position: {
                    numComponents: 2,
                    data: vertices
                }
            },
            cover: {
                position: {
                    numComponents: 2,
                    data: [minX, minY, maxX, minY, maxX, maxY, minX, maxY]
                },
                indices: {
                    numComponents: 3,
                    data: [0, 1, 2, 2, 3, 0]
                }
            }
        };
    },

    isShapeDirty() {
        // Now check if any path has updated since last tessellation.
        let dirty = this._isShapeDirty;
        if (dirty) {
            return true;
        }
        const {
            _paths
        } = this;
        if (_paths) {
            for (const {
                    p
                } of _paths) {
                if (p.isShapeDirty()) {
                    dirty = true;
                    break;
                }
            }
        }
        return dirty;
    },


    /// Returns true when the shape needed to re-tessellate.
    updateTessellation(renderer) {
        // First ensure contour is up to date (might've already updated via
        // clipping or something so we can't use that as a metric for whether to
        // re-tessellate alone). 
        this.updateContour(renderer);

        if (!this.isShapeDirty()) {
            return false;
        }

        const {
            gl,
            Tess
        } = renderer;

        // Contour needs to be done in shape space, so we have to transform all sub-paths.
        const tess = new Tess();

        // We don't have to concatenate matrices as we recurse because we know
        // that Rive only uses the local matrix when the path actually has
        // commands. Note this may change in the future and will require
        // concatenating the matrices (but we don't plan on it right now).
        function addContours(p, m) {
            const {
                _paths
            } = p;
            p._isShapeDirty = false;
            if (_paths) {
                for (const {
                        p,
                        m
                    } of _paths) {
                    addContours(p, m);
                }
                return;
            }
            if (m2d.same(identity, m)) {
                tess.addContours(new Float32Array(p.contour));
            } else {
                var transformedContour = new Float32Array(p.contour);
                const l = transformedContour.length;

                const m0 = m[0];
                const m1 = m[1];
                const m2 = m[2];
                const m3 = m[3];
                const m4 = m[4];
                const m5 = m[5];

                for (let i = 0; i < l; i += 2) {
                    const x = transformedContour[i];
                    const y = transformedContour[i + 1];
                    transformedContour[i] = m0 * x + m2 * y + m4;
                    transformedContour[i + 1] = m1 * x + m3 * y + m5;
                }

                tess.addContours(transformedContour);

            }
        }
        addContours(this, identity);

        try {

            const result = tess.tesselate({
                windingRule: 1 - ((this._fillRule && this._fillRule.value) || 0),
                elementType: 0, // polygon,
                polySize: 3,
                vertexSize: 2
            });

            if (result) {
                this.meshInfo = twgl.createBufferInfoFromArrays(gl, {
                    position: {
                        numComponents: 2,
                        data: result.vertices
                    },
                    indices: {
                        numComponents: 3,
                        data: new Uint16Array(result.elements)
                    }
                });
                if (!done) {
                    done = true;
                }
            }
            tess.dispose();
        } catch (error) {
            console.log('error', error);
        }
        return true;
    },

    drawMesh(renderer, transform, programInfo) {
        this.updateTessellation(renderer);
        const {
            meshInfo
        } = this;
        if (!meshInfo) {
            return;
        }
        const {
            gl
        } = renderer;

        const uniforms = {
            transform: m2d.mat4(transform)
        };

        twgl.setBuffersAndAttributes(gl, programInfo, meshInfo);
        twgl.setUniforms(programInfo, uniforms);
        twgl.drawBufferInfo(gl, meshInfo);
    }
}

let done = false;
const identity = m2d.init();