import MaterialManager from './Material/MaterialManager';
import MeshManager from './Mesh/MeshManager';
import Material from './Material/Material';
import {DefaultVertexShaderParameter} from './Material/MaterialTypes';
import {GetDefaultMaterialConfig} from './Material/MaterialHelper';

import Mesh from './Mesh/Mesh';
import ShapeObject from './ShapeObject';
import Transform from './Transform';
import {Vec3, vec3} from '@thi.ng/vectors';
import {GLProgramIDs} from '../Utility/KatachiStringSet';
import {RandomChar} from '../Utility/UtilityMethod';

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
        let transform = new Transform(Vec3.ZERO, Vec3.ZERO, Vec3.ONE);
        let shapeObject : ShapeObject = new ShapeObject(transform, mesh, material);

        shapeObject.name = shapeName;
        shapeObject.id = RandomChar(11);

        let defaultMatConfig = GetDefaultMaterialConfig(this._gl);
        defaultMatConfig.attributes[DefaultVertexShaderParameter.vertex].value = mesh.meshData.vertex;
        // defaultMatConfig.attributes[DefaultVertexShaderParameter.uv].value = mesh.meshData.uv;
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