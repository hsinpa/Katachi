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
        uniforms : [DefaultVertexShaderParameter.time, DefaultVertexShaderParameter.mainColor, DefaultVertexShaderParameter.mainTex,  
                    DefaultVertexShaderParameter.modelMatrix, DefaultVertexShaderParameter.modelViewProjectionMatrix, DefaultVertexShaderParameter.inverseTransposeModelMatrix,
                    DefaultVertexShaderParameter.directionLightColor, DefaultVertexShaderParameter.directionLightDir, DefaultVertexShaderParameter.ambientLightColor],

        texture : [DefaultVertexShaderParameter.mainTex],
            
        count : 0
    }

    return config;
}

export function GetGLTexture(gl : WebGLRenderingContext, textureSequence : number) : number {
    switch(textureSequence) {
        case 1 :
            return gl.TEXTURE0
        case 2 :
            return gl.TEXTURE1
        case 3 :
            return gl.TEXTURE2
        case 4 :
            return gl.TEXTURE3

        return gl.TEXTURE4;
    }
}