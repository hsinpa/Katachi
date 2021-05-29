import {DefaultVertexShaderParameter} from "../Material/MaterialTypes.js";
export default class ScreenMaterial {
  constructor(material, gl) {
    this.material = material;
    this.shaderConfig = {
      attributes: {
        a_vertex: {
          value: this.GetQuadVertex(),
          drawType: WebGLRenderingContext.STATIC_DRAW,
          vertexPointer: {size: 3, type: gl.FLOAT, normalize: false}
        },
        a_uv: {
          value: this.GetQuadUV(),
          drawType: WebGLRenderingContext.STATIC_DRAW,
          vertexPointer: {size: 2, type: gl.FLOAT, normalize: false}
        }
      },
      uniforms: [DefaultVertexShaderParameter.vertex, DefaultVertexShaderParameter.uv],
      texture: [{id: DefaultVertexShaderParameter.mainTex}],
      count: 6
    };
    this.material.PreloadProperties(gl, this.shaderConfig);
  }
  AutoLoadProperties(gl) {
    this.material.ExecuteAttributeProp(gl, DefaultVertexShaderParameter.vertex);
    this.material.ExecuteAttributeProp(gl, DefaultVertexShaderParameter.uv);
  }
  GetQuadVertex() {
    return [
      -1,
      -1,
      0,
      -1,
      1,
      0,
      1,
      -1,
      0,
      1,
      -1,
      0,
      -1,
      1,
      0,
      1,
      1,
      0
    ];
  }
  GetQuadUV() {
    return [
      0,
      0,
      0,
      1,
      1,
      0,
      1,
      0,
      0,
      1,
      1,
      1
    ];
  }
}
