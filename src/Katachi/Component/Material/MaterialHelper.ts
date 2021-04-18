import Material from "./Material";
import {ShaderConfigType} from "./MaterialTypes";


export function GetDefaultMaterialConfig(gl : WebGLRenderingContext) {
    let config : ShaderConfigType = {
        attributes : {
            a_vertex : {
                value : [],
                drawType : WebGLRenderingContext.STATIC_DRAW,
                vertexPointer : {size : 4, type : gl.FLOAT, normalize: false},
            },
            // a_uv : {
            //     value : [],
            //     drawType : WebGLRenderingContext.STATIC_DRAW,
            //     vertexPointer : {size : 2, type : gl.FLOAT, normalize: false},
            // }
        },
        uniforms : ["u_time", "u_mainColor"],
        count : 0
    }

    return config;
}