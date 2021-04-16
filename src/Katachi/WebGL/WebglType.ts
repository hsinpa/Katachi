export interface GLSLDataSet {
    vertex_shader : string;
    fragment_shader : string;
}

export interface KatachiConfigJson {
    canvas_dom_query : string,
    canvas_height : number,
    canvas_width : number,
    canvas_type : number, //0 = Base on canvas height/width parameter; 1 = Relative to parent dom
    standard_vertex_shader : string;
    standard_fragment_shader : string;
}

