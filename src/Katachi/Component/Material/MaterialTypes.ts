export interface GLAttrShaderPosition {
    [id: string] : {
        position_id : number,
        buffer : WebGLBuffer,
        vertexPointer : VertexPointerConfig
    }
} 

export interface GLUniformShaderPosition {
    [id: string] : WebGLUniformLocation
} 

export interface GLUniformTextures {
    [id: string] : WebGLTexture
} 

export interface CustomShaderProperties {
    value : number[],
    drawType : number // gl.STATIC_DRAW ...
    vertexPointer : VertexPointerConfig
}

export interface ShaderAttributConfigType {
    [id: string] : CustomShaderProperties
}

export interface VertexPointerConfig {
    size : number,
    type : number,
    normalize : boolean
}

export interface ShaderConfigType {
    attributes : ShaderAttributConfigType,
    uniforms : string[],
    count : number
}

export const DefaultVertexShaderParameter = {
    //Attrib
    vertex : "a_vertex",
    color : "a_color",
    uv : "a_uv",
    normal : "a_normal",

    //Uniform
    time : "u_time",
    mainColor : "u_mainColor",
    mainTex : "u_mainTex",
    worldPosition : "u_worldPosition",
    modelViewProjectionMatrix : "u_MVPMatrix"
}

export interface UniformProperties {
    [id: string] : UniformAttrType
}

export interface UniformAttrType {
    function : GLUniformFunction,
    isMatrix : boolean,
    texture : number, // Default 0 == No Texture
    value : any
}

export type GLUniformFunction = (locationPoint : WebGLUniformLocation, dataset : any) => void;
