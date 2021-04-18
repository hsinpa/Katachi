import {} from './MaterialHelper';
import WebglSetupHelper from '../../WebGL/WebglSetupHelper';
import WebglResource from '../../WebGL/WebglResource';
import {GLProgramIDs} from '../../Utility/KatachiStringSet'
import {KatachiConfigJson} from '../../WebGL/WebglType';
import {GetDefaultMaterialConfig} from './MaterialHelper'
import Material from './Material'

interface MaterialCacheType {
    [id: string] : Material
} 

class MaterialManager {
    private _webglSetupHelper : WebglSetupHelper;
    private _webglResource : WebglResource;
    private _configJson : KatachiConfigJson;
    private _gl : WebGLRenderingContext;
    private _materialCache : MaterialCacheType;

    constructor(configJson : KatachiConfigJson, gl : WebGLRenderingContext, webglSetupHelper : WebglSetupHelper, webglResource : WebglResource) {
        this._configJson = configJson;
        this._gl = gl;
        this._webglSetupHelper = webglSetupHelper;
        this._webglResource = webglResource;
        this._materialCache = {};
    }

    public GetMaterial(id : string) : Material {
        if (!(id in this._materialCache)) return null;

        return this._materialCache[id];
    }

    public async SetDefaultMaterial() {
        let glslSources = await this._webglResource.PrepareVFShaders(this._configJson.standard_vertex_shader, this._configJson.standard_fragment_shader);

        let standardMat = this._webglSetupHelper.CreateMaterial(GLProgramIDs.Standard, this._gl, glslSources.vertex_shader, glslSources.fragment_shader); 

        // let defaultMatConfig = GetDefaultMaterialConfig(this._gl);
        // standardMat.PreloadProperties(this._gl, defaultMatConfig);

        this._materialCache[GLProgramIDs.Standard] = standardMat;
    }
}

export default MaterialManager;