import Material from "./Material";
import {ShaderConfigType, DefaultVertexShaderParameter} from "./MaterialTypes";


export function GetDefaultMaterialConfig(gl : WebGLRenderingContext) {
    let config : ShaderConfigType = {
        attributes : {
            a_vertex : {
                value : [],
                drawType : WebGLRenderingContext.STATIC_DRAW,
                vertexPointer : {size : 4, type : gl.FLOAT, normalize: false},
            },
            a_uv : {
                value : [],
                drawType : WebGLRenderingContext.STATIC_DRAW,
                vertexPointer : {size : 2, type : gl.FLOAT, normalize: false},
            },
            a_color : {
                value : [],
                drawType : WebGLRenderingContext.STATIC_DRAW,
                vertexPointer : {size : 4, type : gl.FLOAT, normalize: true},
            },
            a_normal : {
                value : [],
                drawType : WebGLRenderingContext.STATIC_DRAW,
                vertexPointer : {size : 3, type : gl.FLOAT, normalize: true},
            }
        },
        uniforms : [DefaultVertexShaderParameter.time, DefaultVertexShaderParameter.mainColor,
                     DefaultVertexShaderParameter.worldPosition, DefaultVertexShaderParameter.viewMatrix],
        count : 0
    }

    return config;
}