import RenderFrameBuffer from "./RenderFrameBuffer";
import ScreenMaterial from "./ScreenMaterial";
import {ShaderConfigType, DefaultVertexShaderParameter} from '../Material/MaterialTypes';

interface PostProcessSet {
    frameObject : RenderFrameBuffer,
    textureBuffer : WebGLTexture
}

export default class PostProcessingPipeline {

    gl : WebGLRenderingContext;
    
    postProcessStack : PostProcessSet[];
    screenMaterial : ScreenMaterial;

    constructor(gl : WebGLRenderingContext, screenMaterial : ScreenMaterial) {
        this.gl = gl;
        this.postProcessStack = [];

        this.screenMaterial = screenMaterial;
    }

    public AppendBuffer(renderFrameBuffer : RenderFrameBuffer, textureBuffer : WebGLTexture) {
        this.postProcessStack.push({frameObject : renderFrameBuffer, textureBuffer : textureBuffer});
    }

    public Process(startTextureBuffer : WebGLTexture) {
        let gl = this.gl;
        let stackLength = this.postProcessStack.length;

        let previousTextureBuffer = startTextureBuffer;
        for (let i = 0 ; i < stackLength; i++) {
            let ppSet = this.postProcessStack[i];

            this.ProcessScreenRender(gl, (i == stackLength - 1) ? null : ppSet.frameObject.frameBuffer, ppSet.frameObject.width, ppSet.frameObject.height,  previousTextureBuffer);

            previousTextureBuffer = ppSet.textureBuffer;
        }
    }

    private ProcessScreenRender(gl : WebGLRenderingContext, frameBuffer : WebGLFramebuffer, width : number, height : number, mainTex : WebGLTexture) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
        gl.viewport(0, 0, width, height);        
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        this.screenMaterial.AutoLoadProperties(gl);
        this.screenMaterial.material.ExecuteUniformTex(this.gl, DefaultVertexShaderParameter.mainTex, mainTex);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    public Clear() {
        this.postProcessStack = [];
    }
}