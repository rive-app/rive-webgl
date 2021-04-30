import 'regenerator-runtime/runtime';
import * as dat from 'dat.gui';
import Stats from 'stats.js';
import classes from './main.css';
import riveCanvas, {
    RenderPaint,
    RenderPath
} from 'rive-canvas';
import createTess2Wasm from 'tess2-wasm';

import StcRenderer from './src/stc/stc_renderer.js';
import StcRenderPath from './src/stc/stc_render_path.js';
import StcRenderPaint from './src/stc/stc_render_paint.js';

import TessRenderer from './src/tess/tess_renderer.js';
import TessRenderPath from './src/tess/tess_render_path.js';
import TessRenderPaint from './src/tess/tess_render_paint.js';

const files = [
    'marty_v2.riv',
    'jc_emoji.riv',

    'control.riv',
    'knight_square_2.riv',


    'star_gradient_squish.riv',
    'star_complex_gradient.riv',
    'star_with_gradient_rect.riv',
    'star.riv',

    'clipped_circle_star.riv',
    'clipped_circle_star_2.riv',
    'clipped_circle.riv',
    'evenodd.riv',
    'nonzero.riv',
];


async function main() {
    var stats = new Stats();
    document.body.appendChild(stats.dom);

    createTess2Wasm().then(async function ({
        Tess
    }) {
        const rive = await riveCanvas({
            locateFile: file => 'https://unpkg.com/rive-canvas@0.7.1/' + file
        });

        // Store this as we override it whenever we load a file to use the right
        // renderer. It's a hack, in production most people would use a single
        // renderer.
        const context2DRenderFactory = rive.renderFactory;

        const glStcRenderer = rive.Renderer.extend('StcRenderer', StcRenderer);
        const glStcRenderPaint = rive.RenderPaint.extend('StcRenderPaint', StcRenderPaint);
        const glStcRenderPath = rive.RenderPath.extend('StcRenderPath', StcRenderPath);

        const glTessRenderer = rive.Renderer.extend('TessRenderer', TessRenderer);
        const glTessRenderPaint = rive.RenderPaint.extend('TessRenderPaint', TessRenderPaint);
        const glTessRenderPath = rive.RenderPath.extend('TessRenderPath', TessRenderPath);

        const renderers = {
            StencilThenCover: {
                renderer: glStcRenderer,
                factory: {
                    makeRenderPaint() {
                        return new glStcRenderPaint();
                    },
                    makeRenderPath() {
                        return new glStcRenderPath();
                    }
                },
            },
            Tessellation: {
                renderer: glTessRenderer,
                factory: {
                    makeRenderPaint() {
                        return new glTessRenderPaint();
                    },
                    makeRenderPath() {
                        return new glTessRenderPath();
                    }
                },
            }
        };

        let selectedRenderer = renderers.Tessellation;


        let file = null;
        let artboard = null;
        let animation = null;
        let enableWebGL = true;
        let enableCanvas = true;
        let clipArtboard = false;
        let contourQuality = 0.8888888888888889;

        const maxContourError = 5;
        const minContourError = 0.5;

        function contourError() {
            return minContourError * contourQuality + maxContourError * (1 - contourQuality);
        }


        let lastFilename;
        async function changeFile(filename) {
            lastFilename = filename;
            let fileBytes = new Uint8Array(
                await (await fetch(new Request(filename))).arrayBuffer()
            );
            file && file.delete();


            initCanvas(document.getElementById('right_canvas'), fileBytes, enableWebGL ? selectedRenderer.renderer : null, selectedRenderer.factory, true);
            initCanvas(document.getElementById('left_canvas'), fileBytes, enableCanvas ? rive.CanvasRenderer : null, context2DRenderFactory, !enableWebGL);
        }

        function reloadFile() {
            changeFile(lastFilename);
        }

        function initCanvas(canvas, fileBytes, rendererType, renderFactory, measure) {
            if (canvas.frame) {
                cancelAnimationFrame(canvas.frame);
            }
            if (rendererType == null) {
                return;
            }
            rive.renderFactory = renderFactory;
            const file = rive.load(fileBytes);
            const artboard = file.defaultArtboard();

            // now we can create a Rive renderer and wire it up to our 2D context
            const ctx = rendererType == rive.CanvasRenderer ? canvas.getContext('2d') : null;
            const renderer = new rendererType(ctx || canvas, clipArtboard, contourError());
            // Hack to make tess library available.
            renderer.Tess = Tess;

            const firstAnimation =
                artboard.animationCount() > 0 ?
                new rive.LinearAnimationInstance(artboard.animationByIndex(0)) :
                null;

            let time = performance.now();

            function drawFrame() {
                if (measure) {
                    stats.begin();
                }

                const rect = canvas.getBoundingClientRect();
                if (rect.width != canvas.width || rect.height != canvas.height) {
                    canvas.width = rect.width;
                    canvas.height = rect.height;
                }
                renderer.save();
                const now = performance.now();
                const elapsedTime = (now - time) / 1000;
                time = now;

                // Apply our animation at the first frame (0 time, mix of 1).
                if (firstAnimation) {
                    firstAnimation.advance(elapsedTime);
                    firstAnimation.apply(artboard, 1);
                }

                // advance the artboard to render a frame
                artboard.advance(elapsedTime);
                if (rendererType == rive.CanvasRenderer) {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                }
                if (renderer.startFrame) {
                    renderer.startFrame();
                }

                // Let's make sure our frame fits into our canvas
                renderer.align(
                    rive.Fit.contain,
                    rive.Alignment.center, {
                        minX: 0,
                        minY: 0,
                        maxX: canvas.width,
                        maxY: canvas.height
                    },
                    artboard.bounds
                );

                // and now we can draw our frame to our canvas
                artboard.draw(renderer);

                if (renderer.endFrame) {
                    renderer.endFrame();
                }
                // if (animate) {
                canvas.frame = requestAnimationFrame(drawFrame);
                // }
                renderer.restore();
                if (measure) {
                    stats.end();
                }
            }
            drawFrame();
        }

        const gui = new dat.GUI({
            width: 300
        });

        gui.add({
            _file: files[0],
            get file() {
                return this._file;
            },
            set file(value) {
                this._file = value;
                changeFile(value);
            }
        }, 'file', files);

        const rendererKeys = {};
        const rendererToKey = new Map();
        for (let key in renderers) {
            rendererKeys[key] = key;
            rendererToKey.set(renderers[key], key);
        }

        gui.add({
            get technique() {
                return rendererToKey.get(selectedRenderer);
            },
            set technique(value) {
                selectedRenderer = renderers[value];
                reloadFile();
            }
        }, 'technique', rendererKeys);

        gui.add({
            get canvas() {
                return enableCanvas;
            },
            set canvas(value) {
                enableCanvas = value;
                reloadFile();
            }
        }, 'canvas');

        gui.add({
            get webgl() {
                return enableWebGL;
            },
            set webgl(value) {
                enableWebGL = value;
                reloadFile();
            }
        }, 'webgl');

        gui.add({
            get clipArtboard() {
                return clipArtboard;
            },
            set clipArtboard(value) {
                clipArtboard = value;
                reloadFile();
            }
        }, 'clipArtboard');
        gui.add({
            get contourQuality() {
                return contourQuality;
            },
            set contourQuality(value) {
                contourQuality = value;
                reloadFile();
            }
        }, 'contourQuality').min(0).max(1.0);

        await changeFile(files[0]);
    });
};
main();