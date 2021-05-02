import {} from './MaterialHelper';
import WebglResource from '../../WebGL/WebglResource';
import {GLProgramIDs} from '../../Utility/KatachiStringSet'
import {KatachiConfigJson, KatachiShaderType} from '../../WebGL/WebglType';
import {GetDefaultMaterialConfig} from './MaterialHelper'
import Material from './Material';
import ShapeObject from '../Shape/ShapeObject';
import {RandomChar} from '../../Utility/UtilityMethod';

interface ShaderCacheType {
    [id: string] : ShaderDataType
} 

interface ShaderDataType {
    vertShader : WebGLShader,
    fragShader : WebGLShader
}

class MaterialManager {
    private _webglResource : WebglResource;
    private _gl : WebGLRenderingContext;
    private _shaderCache : ShaderCacheType;

    constructor(gl : WebGLRenderingContext, webglResource : WebglResource) {
        this._gl = gl;
        this._webglResource = webglResource;
        this._shaderCache = {};
    }

    public GetGlShaderSet(id : string) {
        if (id in this._shaderCache) return this._shaderCache[id];

        return null;
    }

    public async LoadTextureToObject(shapeObject : ShapeObject, uniformID : string, texture_path : string) {
        let tex = await this._webglResource.GetImage(texture_path);

        shapeObject.SetCustomUniformAttr(uniformID, {
            isMatrix : false,
            value : tex,
            function : this._gl.uniform1i
        });
    }
    
    async LoadAndPrepareShaders(rawShaderPathArray : KatachiShaderType[]) {
        if (rawShaderPathArray == null) return false;

        let count = rawShaderPathArray.length;
        for (let i = 0; i < count; i++)
            await this.LoadAndPrepareShader(rawShaderPathArray[i].id, rawShaderPathArray[i].vertex, rawShaderPathArray[i].fragment); 

        return true;
    }

    async LoadAndPrepareShader(shader_id : string, vertex_path : string, frag_path : string) {

        if (shader_id in this._shaderCache) return this._shaderCache[shader_id];

        let glslSources = await this._webglResource.PrepareVFShaders(vertex_path, frag_path);

        let vertexShader = this.CreateShader(this._gl.VERTEX_SHADER, glslSources.vertex_shader);
        let fragmentShader = this.CreateShader(this._gl.FRAGMENT_SHADER, glslSources.fragment_shader);

        let shaderDataType : ShaderDataType = {vertShader : vertexShader, fragShader:fragmentShader };

        this._shaderCache[shader_id] = shaderDataType;

        return shaderDataType;
    }

    async CreateMaterialFromRawPath(shader_id : string, vertex_path : string, frag_path : string) : Promise<Material> {
        let shaderDataType = await this.LoadAndPrepareShader(shader_id, vertex_path, frag_path);
        let glProgram = this.CreateGLProgram(shaderDataType.vertShader, shaderDataType.fragShader);

        let material = new Material(RandomChar(6), glProgram, this._webglResource);

        return material;
    }

    CreateMaterial(vertShader : WebGLShader, fragShader : WebGLShader) {
        let glProgram = this.CreateGLProgram(vertShader, fragShader);

        let material = new Material(RandomChar(6), glProgram, this._webglResource);

        return material;
    }

    private CreateShader(type : number, source : string ) {
        let gl : WebGLRenderingContext = this._gl;
        let shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS); //COMPILE_STATUS = return success state
        if (success) {
          return shader;
        }

        console.log(gl.getShaderInfoLog(shader));

        gl.deleteShader(shader);

        return null;
    }

    private CreateGLProgram(vertShader : WebGLShader, fragShader : WebGLShader) {
        let gl : WebGLRenderingContext = this._gl;
        let program = gl.createProgram();
        gl.attachShader(program, vertShader);
        gl.attachShader(program, fragShader);

        gl.linkProgram(program);

        var success = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (success) {
          return program;
        }

        console.log(gl.getProgramInfoLog(program));

        gl.deleteProgram(program);

        return null;
    }

}

export default MaterialManager;