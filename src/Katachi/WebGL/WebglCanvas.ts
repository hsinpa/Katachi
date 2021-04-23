import {KatachiConfigJson} from './WebglType';

class WebglCanvas {

    protected _gl : WebGLRenderingContext;
    protected _configJson : KatachiConfigJson;
    protected _canvasDom : HTMLCanvasElement;

    constructor(configJson : KatachiConfigJson) {
        this._configJson = configJson;

        this._canvasDom = document.querySelector(configJson.canvas_dom_query);
        this._gl = this._canvasDom.getContext('webgl');
        this._gl.enable(this._gl.DEPTH_TEST);
    }
}

export default WebglCanvas;