import MaterialManager from '../Material/MaterialManager';
import MeshManager from '../Mesh/MeshManager';
import Material from '../Material/Material';
import {DefaultVertexShaderParameter} from '../Material/MaterialTypes';
import {GetDefaultMaterialConfig} from '../Material/MaterialHelper';

import Mesh from '../Mesh/Mesh';
import ShapeObject from './ShapeObject';
import Transform from '../Transform/Transform';
import {GLProgramIDs} from '../../Utility/KatachiStringSet';
import {RandomChar} from '../../Utility/UtilityMethod';
import {vec3} from 'gl-matrix';
import { KatachiConfigJson } from '../../WebGL/WebglType';

class ShapeBuilder {

    private _materialManager : MaterialManager;
    private _meshManager : MeshManager;
    private _gl : WebGLRenderingContext;

    constructor(gl : WebGLRenderingContext, materialManager : MaterialManager, meshManager : MeshManager) {
        this._gl = gl;
        this._materialManager = materialManager;
        this._meshManager = meshManager;
    }
    
    Build(shapeName : string, mesh : Mesh, material : Material) : ShapeObject {
        let transform = new Transform(vec3.create(), vec3.create(), vec3.fromValues(1, 1, 1));
        let shapeObject : ShapeObject = new ShapeObject(transform, mesh, material);

        shapeObject.name = shapeName;
        shapeObject.id = RandomChar(11);

        let defaultMatConfig = GetDefaultMaterialConfig(this._gl);
        defaultMatConfig.attributes[DefaultVertexShaderParameter.vertex].value = mesh.meshData.vertex;
        defaultMatConfig.attributes[DefaultVertexShaderParameter.uv].value = mesh.meshData.uv;
        defaultMatConfig.attributes[DefaultVertexShaderParameter.color].value = mesh.meshData.color;
        defaultMatConfig.attributes[DefaultVertexShaderParameter.normal].value = mesh.meshData.normal;

        material.PreloadProperties(this._gl, defaultMatConfig);

        return shapeObject;
    }

    BuildQuad() : ShapeObject {
        let mesh = this._meshManager.CreateQuad();
        let shaderSet = this._materialManager.GetGlShaderSet(GLProgramIDs.Unlit);
        let material = this._materialManager.CreateMaterial(shaderSet.vertShader, shaderSet.fragShader);
        return this.Build("Quad", mesh, material);
    }

    BuildCube() : ShapeObject {
        let mesh = this._meshManager.CreateCube();
        let shaderSet = this._materialManager.GetGlShaderSet(GLProgramIDs.Standard);
        let material = this._materialManager.CreateMaterial(shaderSet.vertShader, shaderSet.fragShader);
        
        return this.Build("Cube", mesh, material);
    }
}

export default ShapeBuilder;