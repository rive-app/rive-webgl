export default {
    clone(a) {
        return new Float32Array(a);
    },
    init() {
        return new Float32Array([1, 0, 0, 1, 0, 0]);
    },
    mul(o, a, b) {
        let a0 = a[0],
            a1 = a[1],
            a2 = a[2],
            a3 = a[3],
            a4 = a[4],
            a5 = a[5];
        let b0 = b[0],
            b1 = b[1],
            b2 = b[2],
            b3 = b[3],
            b4 = b[4],
            b5 = b[5];
        o[0] = a0 * b0 + a2 * b1;
        o[1] = a1 * b0 + a3 * b1;
        o[2] = a0 * b2 + a2 * b3;
        o[3] = a1 * b2 + a3 * b3;
        o[4] = a0 * b4 + a2 * b5 + a4;
        o[5] = a1 * b4 + a3 * b5 + a5;
        return o;
    },
    mat4(a) {
        return new Float32Array([
            a[0],
            a[1],
            0.0,
            0.0,
            a[2],
            a[3],
            0.0,
            0.0,
            0.0,
            0.0,
            1.0,
            0.0,
            a[4],
            a[5],
            0.0,
            1.0
        ]);
    },
    same(a, b) {
        return (
            a[0] == b[0] &&
            a[1] == b[1] &&
            a[2] == b[2] &&
            a[3] == b[3] &&
            a[4] == b[4] &&
            a[5] == b[5]
        );
    },
    fromRive(a) {
        return new Float32Array([a.xx, a.xy, a.yx, a.yy, a.tx, a.ty]);
    }

}