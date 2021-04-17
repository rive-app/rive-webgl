import 'regenerator-runtime/runtime'
import * as dat from 'dat.gui';
import riveCanvas from 'rive-canvas';
import * as twgl from 'twgl.js';

const files = [
    'star.riv',
    'clipped_circle_star_2.riv',
    'clipped_circle_star.riv',
    'clipped_circle.riv',
    'evenodd.riv',
    'nonzero.riv',
];

async function changeFile(filename) {
    let fileBytes = new Uint8Array(
        await (await fetch(new Request(filename))).arrayBuffer()
    );
    console.log(fileBytes);
}

async function main() {
    const rive = await riveCanvas({
        locateFile: file => 'https://unpkg.com/rive-canvas@0.7.1/' + file
    });
    console.log('packages', dat, rive, twgl);
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