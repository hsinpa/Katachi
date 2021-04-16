import {KatachiConfigJson} from './WebglType';
import WebglSetupHelper from './WebglSetupHelper';
import WebglResource from './WebglResource';

import {GLShaderIDs, GLProgramIDs} from '../Utility/KatachiStringSet';

class WebglCanvas {

    private _gl : WebGLRenderingContext;
    private _configJson : KatachiConfigJson;
    private _canvasDom : HTMLCanvasElement;

    webglSetupHelper : WebglSetupHelper;
    webglResouceAlloc : WebglResource;

    constructor(configJson : KatachiConfigJson) {
        this.webglResouceAlloc = new WebglResource();
        this.webglSetupHelper = new WebglSetupHelper(this.webglResouceAlloc);

        this._configJson = configJson;

        this._canvasDom = document.querySelector(configJson.canvas_dom_query);
        this._gl = this._canvasDom.getContext('webgl');
    }

    public async SetUp() {
        if (!this._gl) return false;
        
        let glslSources = await this.webglResouceAlloc.PrepareVFShaders(this._configJson.standard_vertex_shader, this._configJson.standard_vertex_shader);

        this.webglSetupHelper.CreateMaterial(GLProgramIDs.Standard, this._gl, glslSources.vertex_shader, glslSources.fragment_shader);

        return true;
    }

    public DrawCanvas() {
        let gl = this._gl;
        
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);

    }

}

export default WebglCanvas;