import MaterialManager from '../Material/MaterialManager';
import MeshManager from '../Mesh/MeshManager';
import Material from '../Material/Material';
import {DefaultVertexShaderParameter} from '../Material/MaterialTypes';
import {GetDefaultMaterialConfig} from '../Material/MaterialHelper';

import Mesh from '../Mesh/Mesh';
import ShapeObject from './ShapeObject';
import Transform from '../Transform';
import {GLProgramIDs} from '../../Utility/KatachiStringSet';
import {RandomChar} from '../../Utility/UtilityMethod';
import {vec3} from 'gl-matrix';

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
        let zeroVector = vec3.fromValues(0,0,0);
        let oneVector = vec3.fromValues(1, 1, 1);

        let transform = new Transform(zeroVector, zeroVector, oneVector);
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
        let material = this._materialManager.GetMaterial(GLProgramIDs.Standard);
        
        return this.Build("Quad", mesh, material);
    }
}

export default ShapeBuilder;