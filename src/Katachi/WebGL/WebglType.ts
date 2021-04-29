export interface ShaderRawSourceType {
    vertex_shader : string;
    fragment_shader : string;
}

export interface KatachiConfigJson {
    canvas_dom_query : string,
    canvas_height : number,
    canvas_width : number,
    canvas_type : number, //0 = Base on canvas height/width parameter; 1 = Relative to parent dom

    shaders : KatachiShaderType[]
}

export interface KatachiShaderType {
    id: string,
    vertex : string;
    fragment : string;        
}