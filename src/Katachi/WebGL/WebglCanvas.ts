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

    private maxDrawBufferSize = 2048;

    public get webglContext() {
        return this._gl;
    } 

    constructor(configJson : KatachiConfigJson) {
        this._configJson = configJson;

        this._canvasDom = document.querySelector(configJson.canvas_dom_query);
        this._gl = this._canvasDom.getContext('webgl', {stencil: true});
        this._gl.enable(this._gl.DEPTH_TEST);
        this._gl.enable(this._gl.STENCIL_TEST);

        this.AutoSetCanvasSize();

        let depth_texture_extension = this._gl.getExtension('WEBGL_depth_texture');
        if (!depth_texture_extension) {
          console.log('This WebGL program requires the use of the ' +
            'WEBGL_depth_texture extension. This extension is not supported ' +
            'by your browser, so this WEBGL program is terminating.');
          return;
        }

        window.addEventListener('resize', () => {
            this.AutoSetCanvasSize();
        });
    }

    private AutoSetCanvasSize() {
      this.SetCanvasToSceenSize(this._canvasDom.clientWidth, this._canvasDom.clientHeight);
    }

    private SetCanvasToSceenSize(displayWidth : number, displayHeight : number) {
      //Set default to 2k resolution, if user has high spec digital screen

      if (displayWidth > this.maxDrawBufferSize || displayHeight > this.maxDrawBufferSize) {
        displayHeight = (displayHeight > displayWidth) ? this.maxDrawBufferSize : (this.maxDrawBufferSize * displayHeight / displayWidth);
        displayWidth = (displayWidth >= displayHeight) ? this.maxDrawBufferSize : (this.maxDrawBufferSize * displayWidth / displayHeight);
      }

      console.log(displayWidth +", " + displayHeight);

      this._canvasDom.width = displayWidth;
      this._canvasDom.height = displayHeight;
  }
}

export default WebglCanvas;