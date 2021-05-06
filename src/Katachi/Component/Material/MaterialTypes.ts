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
    [id: string] : {
        texture : WebGLTexture,
        path : string
    }
} 

export interface CustomShaderProperties {
    value : number[],
    drawType : number // gl.STATIC_DRAW ...
    vertexPointer : VertexPointerConfig
}

export interface ShaderAttributConfigType {
    [id: string] : CustomShaderProperties
}

export interface ShaderUniformConfigType {
    id : string,
    texture? : boolean
}

export interface VertexPointerConfig {
    size : number,
    type : number,
    normalize : boolean
}

export interface ShaderConfigType {
    attributes : ShaderAttributConfigType,
    uniforms : string[],
    texture : UniformTextureDefine[],
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
    modelMatrix : "u_modelMatrix",
    inverseTransposeModelMatrix : "u_inverseTransposeModelMatrix",
    modelViewProjectionMatrix : "u_MVPMatrix",

    //Uniform Light
    directionLightDir : "u_directionLightDir",
    directionLightColor : "u_directionLightColor",
    ambientLightColor : "u_ambientLightColor",
    depthMapTexture : 'u_depthTex',
    lightSpaceMVPMatrix : 'u_lightSpaceMVPMatrix'
}

export interface UniformTextureDefine {
    id : string,
    texture? : string
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
