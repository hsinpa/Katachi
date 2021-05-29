import WebglResource from "../../WebGL/WebglResource";

export default class RenderFrameBuffer {

    private gl : WebGLRenderingContext;
    private webglResouceAlloc : WebglResource;

    private _height : number;
    private _width : number;

    public get height() { return this._height; };
    public get width() { return this._width; };

    public get _aspect() {
        return this._width / this._height;
    }

    private colorTex : WebGLTexture;

    private _frameBuffer : WebGLFramebuffer;
    public get frameBuffer() {
        return this._frameBuffer;
    }

    constructor(gl : WebGLRenderingContext, webglResouceAlloc : WebglResource) {
        this.gl = gl;
        this.webglResouceAlloc = webglResouceAlloc;
    }

    SetFrameBufferSize(width : number, height : number) {
        this._width = width;
        this._height = height;
        
        this.colorTex = this.webglResouceAlloc.CreateGLTexture(this.gl, width, height, this.gl.RGBA, this.gl.UNSIGNED_BYTE, null);
    }

    CreateFrameBuffer(width : number, height : number) {
        let gl = this.gl;

        this.SetFrameBufferSize(width, height);

        this._frameBuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this._frameBuffer);

        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.colorTex, 0);

        const depthRenderBuffer = gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER, depthRenderBuffer);
        
        // // make a depth buffer and the same size as the targetTexture
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthRenderBuffer);
        
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }
}