export default class RenderFrameBuffer {
  get height() {
    return this._height;
  }
  get width() {
    return this._width;
  }
  get _aspect() {
    return this._width / this._height;
  }
  get frameBuffer() {
    return this._frameBuffer;
  }
  constructor(gl, webglResouceAlloc) {
    this.gl = gl;
    this.webglResouceAlloc = webglResouceAlloc;
  }
  SetFrameBufferSize(width, height) {
    this._width = width;
    this._height = height;
    this.colorTex = this.webglResouceAlloc.CreateGLTexture(this.gl, width, height, this.gl.RGBA, this.gl.UNSIGNED_BYTE, null);
  }
  CreateFrameBuffer(width, height) {
    let gl = this.gl;
    this.SetFrameBufferSize(width, height);
    this._frameBuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, this._frameBuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.colorTex, 0);
    const depthRenderBuffer = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, depthRenderBuffer);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthRenderBuffer);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }
}
