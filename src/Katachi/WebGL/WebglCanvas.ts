import {KatachiConfigJson} from './WebglType';

class WebglCanvas {

    protected readonly _gl : WebGLRenderingContext;
    protected _configJson : KatachiConfigJson;
    protected _canvasDom : HTMLCanvasElement;

    //Depth Section
    protected depthFrameBuffer : WebGLFramebuffer;
    protected depthRenderBuffer : WebGLRenderbuffer;
    protected depthColorTexture : WebGLTexture;
    protected depthZindexTexture : WebGLTexture;

    public get webglContext() {
        return this._gl;
    } 

    constructor(configJson : KatachiConfigJson) {
        this._configJson = configJson;

        this._canvasDom = document.querySelector(configJson.canvas_dom_query);
        this._gl = this._canvasDom.getContext('webgl');
        this._gl.enable(this._gl.DEPTH_TEST);


        let depth_texture_extension = this._gl.getExtension('WEBGL_depth_texture');
        if (!depth_texture_extension) {
          console.log('This WebGL program requires the use of the ' +
            'WEBGL_depth_texture extension. This extension is not supported ' +
            'by your browser, so this WEBGL program is terminating.');
          return;
        }
    }
}

export default WebglCanvas;