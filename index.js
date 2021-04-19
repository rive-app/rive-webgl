import 'regenerator-runtime/runtime';
import * as dat from 'dat.gui';
import classes from './main.css';
import riveCanvas, {
    RenderPaint,
    RenderPath
} from 'rive-canvas';
import * as twgl from 'twgl.js';
import GLRenderer from './src/gl_renderer.js';
import GLRenderPath from './src/gl_render_path.js';
import GLRenderPaint from './src/gl_render_paint.js';

const files = [
    'star_with_gradient_rect.riv',
    'star.riv',
    'clipped_circle_star_2.riv',
    'clipped_circle_star.riv',
    'clipped_circle.riv',
    'evenodd.riv',
    'nonzero.riv',
];


async function main() {
    const rive = await riveCanvas({
        locateFile: file => 'https://unpkg.com/rive-canvas@0.7.1/' + file
    });

    // Store this as we override it whenever we load a file to use the right
    // renderer. It's a hack, in production most people would use a single
    // renderer.
    const context2DRenderFactory = rive.renderFactory;

    const Renderer = rive.Renderer.extend('GLRenderer', GLRenderer);
    const RenderPaint = rive.RenderPaint.extend('GLRenderPaint', GLRenderPaint);
    const RenderPath = rive.RenderPath.extend('GLRenderPath', GLRenderPath);


    let file = null;
    let artboard = null;
    let animation = null;


    async function changeFile(filename) {
        let fileBytes = new Uint8Array(
            await (await fetch(new Request(filename))).arrayBuffer()
        );
        file && file.delete();

        initCanvas(document.getElementById('gl_canvas'), fileBytes, Renderer, {
            makeRenderPaint() {
                return new RenderPaint();
            },
            makeRenderPath() {
                return new RenderPath();
            }

        });
        initCanvas(document.getElementById('context_2d_canvas'), fileBytes, rive.CanvasRenderer, context2DRenderFactory);

    }

    function initCanvas(canvas, fileBytes, rendererType, renderFactory) {
        if (canvas.frame) {
            cancelAnimationFrame(canvas.frame);
        }
        rive.renderFactory = renderFactory;
        const file = rive.load(fileBytes);
        const artboard = file.defaultArtboard();

        // now we can create a Rive renderer and wire it up to our 2D context
        const ctx = rendererType == rive.CanvasRenderer ? canvas.getContext('2d') : null;

        const renderer = new rendererType(ctx || canvas);

        const firstAnimation =
            artboard.animationCount() > 0 ?
            new rive.LinearAnimationInstance(artboard.animationByIndex(0)) :
            null;

        let time = performance.now();

        function drawFrame() {

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
        }
        drawFrame();
    }

    const gui = new dat.GUI({
        width: 300
    });

    await changeFile(files[0]);

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
};
main();