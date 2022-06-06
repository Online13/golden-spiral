import { arange, wait } from "./utils.js";

/**
 * @typedef {Object} Position
 * @property {number} x
 * @property {number} y
 */

const PHI = (Math.sqrt(5) + 1) / 2;

class GoldenSpiral {

    /** @type {Position} */
    position;
    /** @type {Position} */
    direction;
    /** @type {CanvasRenderingContext2D} */
    ctx;
    /** @type {number} */
    radius;
    /** @type {number} */
    step;
    /** @type {number[]} */
    angle;
    /** @type {string} */
    color;
    /** @type {string} */
    borderColor;
    /** @type {AbortSignal} */
    signal;

    /**
     * 
     * @param {Object} param0 
     * @param {Position} param0.position
     * @param {CanvasRenderingContext2D} param0.ctx
     * @param {number} param0.size
     * @param {string} param0.color
     * @param {string} param0.borderColor
     */
    constructor({ position, ctx, size=280, color, borderColor, signal }) {
        this.ctx = ctx;
        this.position = position;
        
        this.radius = size;
        this.step = this.radius;
        this.angle = [ Math.PI, Math.PI / 2 ];
        this.direction = { x: -1, y: 0 };

        this.color = color;
        this.borderColor = borderColor
        this.signal = signal;
    }

    async render() {
        if (this.signal.aborted) {
            return;
        }

        const interpolation = arange(this.angle[0], this.angle[1], this.radius * 0.10);
        for (let i = 0;i < interpolation.length-1; i++) {
            await this.arc(interpolation[i], interpolation[i+1]);
        }
        const size = interpolation.length;
        this.ctx.strokeStyle = this.borderColor;
        this.ctx.arc(this.position.x, this.position.y, 0, interpolation[size-2], interpolation[size-1], true);
        this.ctx.stroke();
    }

    update() {
        
        // and after the angle for the circle
        if (this.angle[1] < 0)
            this.angle[1] = Math.PI * 1.5;
        this.angle[0] = this.angle[1];
        this.angle[1] = this.angle[0] - Math.PI / 2;
        
        // we update the radius of the circle
        let temp = this.radius;
        this.radius = (PHI - 1) * this.radius;
        this.step = temp - this.radius;
        
        // we update the center position
        this.direction = { x: this.direction.y, y: - this.direction.x };
        this.position.x += this.direction.x * this.step;
        this.position.y += this.direction.y * this.step;
    }

    async arc(startAngle, endAngle) {
        if (this.signal.aborted) {
            return;
        }
        await wait(() => {
            this.ctx.beginPath();
            this.ctx.lineWidth = 2;
            this.ctx.strokeStyle = this.color;
            this.ctx.arc(this.position.x, this.position.y, this.radius, startAngle, endAngle, true);
            this.ctx.stroke();
        }, 1000/60);
    }

    async animate() {
        if (this.signal.aborted) {
            return;
        }

        await this.render();
        this.update();
    }
}

export default GoldenSpiral;