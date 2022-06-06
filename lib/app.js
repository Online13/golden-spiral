import GoldenSpiral from "./GoldenSpiral.js";
import { debounce, wait } from "./utils.js";


class App {

    /** @type {HTMLCanvasElement} */
    canvas;
    /** @type {CanvasRenderingContext2D} */
    ctx;
    /** @type {number} */
    width;
    /** @type {number} */
    height;
    /** @type {number} */
    stageWidth;
    /** @type {number} */
    stageHeight;
    /** @type {number} */
    pixelRatio;
    /** @type {GoldenSpiral} */
    spiral;
    /** @type {string} */
    bgColor;
    /** @type {string} */
    color;
    /** @type {string} */
    borderColor;
    /** 
     * @type {AbortController} 
     * 
     * usefull to stop all async operation when we need to stop them
     **/
    abortController;

    /**
     * 
     * @param {Object} props 
     * @param {string} props.borderColor
     * @param {string} props.background
     * @param {string} props.color
     */
    constructor({ background= 'white', color= 'black', borderColor='#ffffff1a' }) {

        this.color = color;
        this.bgColor = background;
        this.borderColor = borderColor;

        this.canvas = document.querySelector('#canvas');
        this.ctx = canvas.getContext('2d');
        this.ctx.globalCompositeOperation = "darken"

        this.pixelRatio = window.devicePixelRatio > 1 ? 2 : 1;

        this.resize = this.resize.bind(this);
        this.animate = this.animate.bind(this);

        window.addEventListener('resize', debounce(async () => {
            this.abortController.abort();
            await this.clear();
            this.resize();
            await this.start();
        }));
        this.resize();

    }

    resize() {
        
        let domWidth = window.innerWidth;
        let domHeight = window.innerHeight;

        let ratio = domWidth / domHeight;

        // look like responsive
        this.stageWidth = domWidth;
        this.stageHeight = (ratio >= 1.6) ? domHeight : Math.floor(domWidth / 1.618);

        this.width = this.stageWidth * this.pixelRatio;
        this.height = this.stageHeight * this.pixelRatio;

        this.canvas.width = this.width;
        this.canvas.height = this.height;

        Object.assign(this.canvas.style, {
            width: `${this.stageWidth}px`,
            height: `${this.stageHeight}px`,
        });

        this.ctx.scale(this.pixelRatio, this.pixelRatio);
    }

    async animate() {
        for (let i = 0; i < 20; i++) {
            await this.spiral.animate();
        }
    }

    async clear() {
        this.ctx.fillStyle = this.bgColor;
        this.ctx.fillRect(0, 0, this.width, this.height);
        await wait(() => {}, 700);
    }

    async start() {

        let radius = this.stageHeight - 10;
        
        this.abortController = new AbortController();
        this.spiral = new GoldenSpiral({
            position: { x: radius, y: 0 }, 
            ctx: this.ctx, 
            size: radius,
            color: this.color,
            borderColor: this.borderColor,
            signal: this.abortController.signal
        });

        this.clear();
        await this.animate();
    }
}


export default App;