import Material from "../Material/Material";
import {ShaderConfigType, DefaultVertexShaderParameter} from '../Material/MaterialTypes';

export default class ScreenMaterial {

    material : Material;
    vertexBuffer : WebGLBuffer;
    uvBuffer : WebGLBuffer;

    shaderConfig : ShaderConfigType;

    constructor(material : Material, gl : WebGLRenderingContext) {
        this.material = material;

        this.shaderConfig = {
            attributes : {
                a_vertex : {
                    value : this.GetQuadVertex(),
                    drawType : WebGLRenderingContext.STATIC_DRAW,
                    vertexPointer : {size : 3, type : gl.FLOAT, normalize: false},
                },
                a_uv : {
                    value : this.GetQuadUV(),
                    drawType : WebGLRenderingContext.STATIC_DRAW,
                    vertexPointer : {size : 2, type : gl.FLOAT, normalize: false},
                },
            },
            uniforms : [DefaultVertexShaderParameter.vertex, DefaultVertexShaderParameter.uv],
            texture : [{id : DefaultVertexShaderParameter.mainTex}],
            count : 6        
        };

        this.material.PreloadProperties(gl, this.shaderConfig);
    }

    public AutoLoadProperties(gl : WebGLRenderingContext) {
        this.material.ExecuteAttributeProp(gl, DefaultVertexShaderParameter.vertex);
        this.material.ExecuteAttributeProp(gl, DefaultVertexShaderParameter.uv);
    }
    
    private GetQuadVertex() : number[] {
        return [-1, -1, 0,
            -1, 1, 0,
            1, -1, 0,
            1, -1, 0,
            -1, 1, 0,
            1, 1, 0];
    }

    private GetQuadUV() : number[] {
        return [0, 0,
            0, 1,
            1, 0,
            1, 0,
            0, 1,
            1, 1];
    }
}