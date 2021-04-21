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

export let DefaultVertexShaderParameter = {
    //Attrib
    vertex : "a_vertex",
    color : "a_color",
    uv : "a_uv",
    normal : "a_normal",

    //Uniform
    time : "u_time",
    mainColor : "u_mainColor",
    worldPosition : "u_worldPosition",
    viewMatrix : "u_viewMatrix"
}

export interface UniformProperties {
    [id: string] : UniformAttrType
}

export interface UniformAttrType {
    function : GLUniformFunction,
    isMatrix : boolean,
    value : any
}

export type GLUniformFunction = (locationPoint : WebGLUniformLocation, dataset : any) => void;
