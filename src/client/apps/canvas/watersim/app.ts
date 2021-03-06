
import 'config-loader!./.config.ts';
import 'htmlout-loader!./en.html';

console.log(__filename);

//
/* simple 2D Water Simulation

  idea and python code from:https://www.reddit.com/r/cellular_automata/comments/6jhdfw/i_used_1dimensional_cellular_automata_to_make_a/

    C L I C K / H O L D / R E L E A S E  I N S I D E
    T H E  P O O L  T O  A D D  W A T E R
*/

const WIDTH = 300;

const ground = new Array(WIDTH).fill(1);
ground[0] = ground[WIDTH - 1] = 100;

// Predictable randomize multi-sine for generating the ground
// from @shshaw, thx!
let twoPI = Math.PI * 4;
let placement;
const offset = Math.random() + 1.1;
// const offset = 1;
let tmp;
for (let x = 1; x < WIDTH / 2; x++) {
    placement = (x / (WIDTH / 2)) * twoPI;
    ground[x] = tmp = 30 + 10 * ((Math.sin(placement) + Math.sin(offset * placement)) / 2);
}

/* my lame kinda random spiky ground...doh! */
let level = tmp; // Math.random()*50;
for (let x = WIDTH / 2; x < WIDTH - 1; x++) {
    ground[x] = level;
    level = Math.min(100, Math.max(0, level + Math.random() * 8 - 4));
}

// empty pool with a drip of water in the middle
let water = new Array(WIDTH).fill(0);
water[0] = water[WIDTH - 1] = 0;
water[Math.floor(WIDTH / 2)] = 250;

let energy = new Array(WIDTH).fill(0);

// put that thing into the DOM
let wrap = document.getElementById('wrap');
let html = '<div class=\'ww\'></div><div class=\'gw\'></div>';
for (let x = 0; x < WIDTH; x++) {
    let col = document.createElement('div');
    col.classList.add('col');
    col.innerHTML = html;
    wrap.appendChild(col);
}
let cols = document.getElementById('wrap').children; // ...for the renderer

// add the mouse actions
for (let i = 0; i < cols.length; i++) {
    (function (j) {
        cols[i].addEventListener('mousedown', function () {
            let time = Date.now();
            let index = j;
            window.onmouseup = function () {
                let diff = Date.now()  - time;
                window.onmouseup = null;
                water[index] = diff;
            };
        });
    })(i);
}

// calculate the next frame
function calc() {
    let dwater = new Array(WIDTH).fill(0);
    let denergy = new Array(WIDTH).fill(0);

    for (let x = 1; x < WIDTH - 1; x++) {
        const groundPrev = ground[x - 1];
        const groundNow = ground[x];
        const groundNext = ground[x + 1];
        const waterPrev = water[x - 1];
        const waterNow = water[x];
        const waterNext = water[x + 1];
        const energyLeft = energy[x - 1];
        const energyNow = energy[x];
        const energyRight = energy[x + 1];

        const potentialEnergyLeft = groundPrev + waterPrev;
        const potentialEnergy = groundNow + waterNow;
        const potentialEnergyRight = groundNext + waterNext;

        if (0 < waterNow && potentialEnergy - energyNow > potentialEnergyLeft + energyLeft) {
            const waterToGive = Math.min(waterNow, potentialEnergy - energyNow - potentialEnergyLeft - energyLeft) / 4;
            dwater[x - 1] += waterToGive;
            dwater[x] += -waterToGive;
            denergy[x - 1] += -energyLeft / 2 - waterToGive;
        }

        if (0 < waterNow && potentialEnergy + energyNow > potentialEnergyRight - energyRight) {
            const waterToGive = Math.min(waterNow, potentialEnergy + energyNow - potentialEnergyRight + energyRight) / 4;
            dwater[x + 1] += waterToGive;
            dwater[x] += -waterToGive;
            denergy[x + 1] += -energyRight / 2 + waterToGive;
        }
    }

    for (let x = 1; x < WIDTH - 1; x++) {
        water[x] = water[x] + dwater[x];
        energy[x] = energy[x] + denergy[x];
    }
}

// draw the next frame
function draw(terrain, water) {
    for (let i = 0; i < terrain.length; i++) {
        let col = cols[i].children;
        (col[0] as HTMLElement).style.height = Math.min(100 - terrain[i], water[i]) + '%';
        (col[1] as HTMLElement).style.height = terrain[i] + '%';
    }
}

// RUN it!
/* "use reqAnimFr instead of timeout, noob!"  hint from @shshaw, thx! */
function render() {
    requestAnimationFrame(render);
    calc();
    draw(ground, water);
}
requestAnimationFrame(render);
