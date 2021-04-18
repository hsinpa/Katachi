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
    vertex : "a_vertex",
    color : "a_color",
    uv : "a_uv"
}