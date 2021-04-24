import * as twgl from 'twgl.js';
import m2d from './m2d.js';

const PathCommand = {
    move: 0,
    line: 1,
    cubic: 2,
    close: 3
};
export default {
    __construct() {
        this._commands = [];
        this.__parent.__construct.call(this);
        this._isDirty = true;
    },
    reset() {
        this._isDirty = true;
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
    // Build the subdivided contour of the path. This should can be used as the
    // buffer for the fill and the guide for the stroke.
    computeContour() {
        this._isDirty = false;
        // Seed vertices with the "out of bounds" point which we'll update
        // later, this is the origin from which we'll draw our triangles that
        // have on edge on the contour.
        const vertices = [0, 0];
        const indices = [];
        let nextVertexIndex = 1; // offset by first point which is our origin.
        let penDownIndex = 1;

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
            penDownIndex = nextVertexIndex;
            nextVertexIndex++;
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

            const minSegmentLength = 1.0 * 1.0;
            const distTooFar = 1.0;

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
                    indices.push(0, nextVertexIndex - 1, nextVertexIndex++);
                    break;
                case PathCommand.cubic:
                    penDown();
                    const {
                        ox, oy, ix, iy, x, y
                    } = command;

                    const size = vertices.length;
                    segmentCubic(penX, penY, ox, oy, ix, iy, x, y, 0.0, 1.0);
                    const addedVertices = (vertices.length - size) / 2;
                    for (let i = 0; i < addedVertices; i++) {
                        indices.push(0, nextVertexIndex - 1, nextVertexIndex++);
                    }
                    penX = x;
                    penY = y;
                    break;
                case PathCommand.close:
                    if (isPenDown) {
                        penX = penDownX;
                        penY = penDownY;
                        isPenDown = false;

                        // Add the first vertex back to the indices to draw the
                        // close.
                        const lastIndex = indices[indices.length - 1];
                        indices.push(0, lastIndex, penDownIndex);
                    }
                    break;
            }
        }
        // Always close the fill...
        if (isPenDown) {
            const lastIndex = indices[indices.length - 1];
            indices.push(0, lastIndex, penDownIndex);
        }

        // Set min point in vertex buffer.
        vertices[0] = minX;
        vertices[1] = minY;

        // Update the arrays.
        return {
            contour: {
                position: {
                    numComponents: 2,
                    data: vertices
                },
                indices: {
                    numComponents: 3,
                    data: indices
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

    stencil(renderer, transform, idx, isEvenOdd) {
        if (this._paths) {
            for (const path of this._paths) {
                path.p.stencil(
                    renderer,
                    m2d.mul(m2d.init(), transform, path.m),
                    idx++,
                    isEvenOdd
                );
            }
            return;
        }
        const {
            gl,
            projection,
            programInfo
        } = renderer;

        const uniforms = {
            projection: projection,
            transform: m2d.mat4(transform)
        };

        if (this._isDirty) {
            const {
                contour,
                cover
            } = this.computeContour();
            this.contourBufferInfo = twgl.createBufferInfoFromArrays(gl, contour);
            this.coverBufferInfo = twgl.createBufferInfoFromArrays(gl, cover);
        }

        const {
            contourBufferInfo
        } = this;
        if (!contourBufferInfo) {
            return;
        }

        if (isEvenOdd) {
            gl.frontFace(idx % 2 == 0 ? gl.CCW : gl.CW);
        }
        twgl.setBuffersAndAttributes(gl, programInfo, contourBufferInfo);
        twgl.setUniforms(programInfo, uniforms);
        twgl.drawBufferInfo(gl, contourBufferInfo);
    },

    cover(renderer, transform, programInfo, localTransform) {
        if (this._paths) {
            for (const path of this._paths) {
                path.p.cover(renderer, m2d.mul(m2d.init(), transform, path.m), programInfo, path.m);
            }
            return;
        }
        const {
            gl,
            projection
        } = renderer;

        const uniforms = {
            projection: projection,
            transform: m2d.mat4(transform)
        };
        if (localTransform) {
            uniforms.localTransform = m2d.mat4(localTransform);
        } else {
            uniforms.localTransform = m2d.mat4(m2d.init());
        }
        if (this._isDirty) {
            const {
                contour,
                cover
            } = this.computeContour();

            const {
                contourBufferInfo,
                coverBufferInfo
            } = this;
            if (contourBufferInfo) {
                gl.deleteBuffer(contourBufferInfo.attributes.position);
                gl.deleteBuffer(contourBufferInfo.indices);
            }
            if (coverBufferInfo) {
                gl.deleteBuffer(coverBufferInfo.attributes.position);
                gl.deleteBuffer(coverBufferInfo.indices);
            }
            this.contourBufferInfo = twgl.createBufferInfoFromArrays(gl, contour);
            this.coverBufferInfo = twgl.createBufferInfoFromArrays(gl, cover);
        }

        const {
            coverBufferInfo
        } = this;
        if (!coverBufferInfo) {
            return;
        }

        twgl.setBuffersAndAttributes(gl, programInfo, coverBufferInfo);
        twgl.setUniforms(programInfo, uniforms);
        twgl.drawBufferInfo(gl, coverBufferInfo);
    }
}