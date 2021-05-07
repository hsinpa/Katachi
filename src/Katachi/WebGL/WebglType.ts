export interface ShaderRawSourceType {
    vertex_shader : string;
    fragment_shader : string;
}

export interface KatachiConfigJson {
    canvas_dom_query : string,
    shaders : KatachiShaderType[]
}

export interface KatachiShaderType {
    id: string,
    vertex : string;
    fragment : string;        
}