
import {Object} from './webgl';

export const SQUARE = [
[
    -1, -1, 0,
    1, -1, 0,
    1, 1, 0,
    -1, -1, 0,
    -1, 1, 0,
    1, 1, 0,
]
]

export const HALF_SQUARE = [
[
    -0.5,0.5,0.0, 	//Vertex 0
    -0.5,-0.5,0.0, 	//Vertex 1
    0.5,-0.5,0.0, 	//Vertex 2
    0.5,0.5,0.0 	//Vertex 3
], [3,2,1,3,1,0]
]

export const CONE = [
[1.5, 0, 0,
    -1.5, 1, 0,
    -1.5, 0.809017,	0.587785,
    -1.5, 0.309017,	0.951057,
    -1.5, -0.309017, 0.951057,
    -1.5, -0.809017, 0.587785,
    -1.5, -1, -4.10207e-010,
    -1.5, -0.809017, -0.587785,
    -1.5, -0.309017, -0.951057,
    -1.5, 0.309017,	-0.951057,
    -1.5, 0.809017,	-0.587785],
[0, 1, 2,
    0, 2, 3,
    0, 3, 4,
    0, 4, 5,
    0, 5, 6,
    0, 6, 7,
    0, 7, 8,
    0, 8, 9,
    0, 9, 10,
    0, 10, 1]
];

export const CONE6: Object = {
    "vertices": [0.0, 6.0, -2.59787e-16, 3.0, 8.88178e-16, 5.19574e-16, 2.79742, 8.88178e-16, -1.08372, 2.21703, 8.88178e-16, -2.02109, 1.33722, 4.44089e-16, -2.68549, 0.276805, 4.44089e-16, -2.9872, -0.820989, 4.44089e-16, -2.88548, -1.8079, 8.88178e-16, -2.39405, -2.55065, 8.88178e-16, -1.5793, -2.94892, 8.88178e-16, -0.551249, -2.94892, 8.88178e-16, 0.551249, -2.55065, 8.88178e-16, 1.5793, -1.8079, 8.88178e-16, 2.39405, -0.820989, 1.33227e-15, 2.88548, 0.276805, 1.33227e-15, 2.9872, 1.33722, 1.33227e-15, 2.68549, 2.21703, 8.88178e-16, 2.02109, 2.79742, 8.88178e-16, 1.08372, 3.0, 8.88178e-16, -2.46124e-09],
    "indices": [0, 1, 2, 0, 2, 3, 0, 3, 4, 0, 4, 5, 0, 5, 6, 0, 6, 7, 0, 7, 8, 0, 8, 9, 0, 9, 10, 0, 10, 11, 0, 11, 12, 0, 12, 13, 0, 13, 14, 0, 14, 15, 0, 15, 16, 0, 16, 17, 0, 17, 18],
    "diffuse": [1.0, 0.664, 0.0, 1.0]
}

export function createFloor(dim: number = 50, unit = 1): Object {
    const lines = 2 * dim / unit;
    var inc = 2 * dim / lines;
    var v = [];
    var i = [];

    for(var l = 0; l <= lines; l++){
        v[6*l] = -dim;
        v[6*l+1] = 0;
        v[6*l+2] = -dim + (l * inc);

        v[6*l+3] = dim;
        v[6*l+4] = 0;
        v[6*l+5] = -dim+(l*inc);

        v[6*(lines+1)+6*l] = -dim+(l*inc);
        v[6*(lines+1)+6*l+1] = 0;
        v[6*(lines+1)+6*l+2] = -dim;

        v[6*(lines+1)+6*l+3] = -dim+(l*inc);
        v[6*(lines+1)+6*l+4] = 0;
        v[6*(lines+1)+6*l+5] = dim;

        i[2*l] = 2*l;
        i[2*l+1] = 2*l+1;
        i[2*(lines+1)+2*l] = 2*(lines+1)+2*l;
        i[2*(lines+1)+2*l+1] = 2*(lines+1)+2*l+1;
    }
    return {
        vertices: v,
        indices: i,
        wireframe: true,
        diffuse: [0.7,0.7,0.7,1.0]
    }
}

export function createAxis(dim: number = 10): Object {
    return {
        vertices: [
            -dim, 0.0,0.0,
            dim, 0.0,0.0, 0.0,
            -dim / 2,0.0, 0.0,
            dim/2,0.0, 0.0,0.0,
            -dim, 0.0,0.0,
            dim],
        indices: [ 0, 1, 2, 3, 4, 5],
        wireframe: true,
        colors: [	1, 1, 0 ,1,	  1, 1, 0 ,1,	0, 1 ,0 ,1,	 0, 1 ,0 ,1,  0, 0, 1 ,1,	 0, 0, 1 ,1	],
    }
}