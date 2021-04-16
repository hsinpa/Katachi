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
    [id: string] : {
        value : number[],
        drawType : number // gl.STATIC_DRAW ...
        vertexPointer : VertexPointerConfig
    }
}

export interface VertexPointerConfig {
    size : number,
    type : number,
    normalize : boolean
}

export interface ShaderConfigType {
    attributes : CustomShaderProperties,
    uniforms : string[],
    count : number
}
