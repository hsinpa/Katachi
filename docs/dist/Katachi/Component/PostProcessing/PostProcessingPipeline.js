import {DefaultVertexShaderParameter} from "../Material/MaterialTypes.js";
export default class PostProcessingPipeline {
  constructor(gl, screenMaterial) {
    this.gl = gl;
    this.postProcessStack = [];
    this.screenMaterial = screenMaterial;
  }
  AppendBuffer(renderFrameBuffer, textureBuffer) {
    this.postProcessStack.push({frameObject: renderFrameBuffer, textureBuffer});
  }
  Process(startTextureBuffer) {
    let gl = this.gl;
    let stackLength = this.postProcessStack.length;
    let previousTextureBuffer = startTextureBuffer;
    for (let i = 0; i < stackLength; i++) {
      let ppSet = this.postProcessStack[i];
      this.ProcessScreenRender(gl, i == stackLength - 1 ? null : ppSet.frameObject.frameBuffer, ppSet.frameObject.width, ppSet.frameObject.height, previousTextureBuffer);
      previousTextureBuffer = ppSet.textureBuffer;
    }
  }
  ProcessScreenRender(gl, frameBuffer, width, height, mainTex) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
    gl.viewport(0, 0, width, height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    this.screenMaterial.AutoLoadProperties(gl);
    this.screenMaterial.material.ExecuteUniformTex(this.gl, DefaultVertexShaderParameter.mainTex, mainTex);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
  Clear() {
    this.postProcessStack = [];
  }
}
