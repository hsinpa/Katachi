import WebglResource from "./WebglResource";

class WebGLDepthBuffer {

    private _depthMapTex : WebGLTexture;
    public get depthMapTex() {
        return this._depthMapTex;
    }
    
    protected PrepareDepthFrameBuffer(gl : WebGLRenderingContext, webglResouceAlloc : WebglResource, width : number, height : number) {
        const depthColorTexture = webglResouceAlloc.CreateGLTexture(gl, width, height, gl.RGBA, null);
        this._depthMapTex = webglResouceAlloc.CreateGLTexture(gl, width, height, gl.DEPTH_COMPONENT, null);

        const depthFrameBuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, depthFrameBuffer);

        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, depthColorTexture, 0);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, depthColorTexture, 0);

        // const depthRenderBuffer = gl.createRenderbuffer();
        // gl.bindRenderbuffer(gl.RENDERBUFFER, depthRenderBuffer);
        
        // // make a depth buffer and the same size as the targetTexture
        // gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);
        // gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthRenderBuffer);

        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }
}

export default WebGLDepthBuffer;