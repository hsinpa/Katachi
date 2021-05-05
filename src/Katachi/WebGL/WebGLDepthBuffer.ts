import WebglResource from "./WebglResource";
import {DefaultVertexShaderParameter} from "../Component/Material/MaterialTypes";
import MaterialManager from "../Component/Material/MaterialManager";
import {GLProgramIDs} from '../Utility/KatachiStringSet';
import Material from "../Component/Material/Material";
import {GetDefaultMaterialConfig} from '../Component/Material/MaterialHelper';

class WebGLDepthBuffer {

    private _depthMapTex : WebGLTexture;
    public get depthMapTex() {
        return this._depthMapTex;
    }

    private _colorDepthMapTex : WebGLTexture;
    public get colorDepthMapTex() {
        return this._colorDepthMapTex;
    }

    private _depthFrameBuffer : WebGLFramebuffer;
    public get depthFrameBuffer() {
        return this._depthFrameBuffer;
    }

    private _depthMaterial : Material;
    public get depthMaterial() {
        return this._depthMaterial;
    }

    private gl : WebGLRenderingContext;
    private webglResouceAlloc : WebglResource;
    private materialManager : MaterialManager;

    constructor(gl : WebGLRenderingContext, webglResouceAlloc : WebglResource, materialManager : MaterialManager) {
        this.gl = gl;
        this.webglResouceAlloc = webglResouceAlloc;
        this.materialManager = materialManager;
    }

    public CacheDepthMaterial() {
        let glShaderSet = this.materialManager.GetGlShaderSet(GLProgramIDs.DepthMap);
        this._depthMaterial = this.materialManager.CreateMaterial(glShaderSet.vertShader, glShaderSet.fragShader);

        let defaultMatConfig = GetDefaultMaterialConfig(this.gl);

        this._depthMaterial.PreloadProperties(this.gl, defaultMatConfig);
    }
    
    public PrepareDepthFrameBuffer(width : number, height : number) {
        let gl = this.gl;

        this._colorDepthMapTex = this.webglResouceAlloc.CreateGLTexture(gl, width, height, gl.RGBA, gl.UNSIGNED_BYTE, null);
        this._depthMapTex = this.webglResouceAlloc.CreateGLTexture(gl, width, height, gl.DEPTH_COMPONENT, gl.UNSIGNED_INT, null);

        this._depthFrameBuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this._depthFrameBuffer);

        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this._colorDepthMapTex, 0);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, this._depthMapTex, 0);

        // const depthRenderBuffer = gl.createRenderbuffer();
        // gl.bindRenderbuffer(gl.RENDERBUFFER, depthRenderBuffer);
        
        // // make a depth buffer and the same size as the targetTexture
        // gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);
        // gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthRenderBuffer);
        this.webglResouceAlloc.SaveGlobalTextureSource(DefaultVertexShaderParameter.depthMapTexture, this._depthMapTex, gl.TEXTURE0);
        
        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }
}

export default WebGLDepthBuffer;