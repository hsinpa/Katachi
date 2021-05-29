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
    value : number[] | WebGLBuffer,
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
    tangent : "a_tangent",

    //Uniform
    time : "u_time",
    mainColor : "u_mainColor",
    mainTex : "u_mainTex",
    normalTex : "u_normalTex",
    mainTex_Texel : "u_mainTex_Texel",
    modelMatrix : "u_modelMatrix",
    viewMatrix : "u_viewMatrix",
    inverseTransposeModelMatrix : "u_inverseTransposeModelMatrix",
    modelViewProjectionMatrix : "u_MVPMatrix",

    //Uniform Light
    cameraPos : "u_cameraPos",
    specularLightStrength : "u_specularLightStrength",
    directionLightDir : "u_directionLightDir",
    directionLightColor : "u_directionLightColor",
    ambientLightColor : "u_ambientLightColor",
    depthMapTexture : 'u_depthTex',
    depthMapTex_Texel : "u_depthTex_Texel",
    lightSpaceMVPMatrix : 'u_lightSpaceMVPMatrix'
}

export interface UniformTextureDefine {
    id : string,
    texture? : string,
    textureBuffer? : WebGLTexture
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
