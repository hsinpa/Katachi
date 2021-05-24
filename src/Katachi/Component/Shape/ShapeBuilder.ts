import MaterialManager from '../Material/MaterialManager';
import MeshManager from '../Mesh/MeshManager';
import Material from '../Material/Material';
import {DefaultVertexShaderParameter} from '../Material/MaterialTypes';
import {GetDefaultMaterialConfig} from '../Material/MaterialHelper';

import Mesh from '../Mesh/Mesh';
import ShapeObject from './ShapeObject';
import GLTFShapeObject from './GLTFShapeObject';
import Transform from '../Transform/Transform';
import {GLProgramIDs} from '../../Utility/KatachiStringSet';
import {RandomChar} from '../../Utility/UtilityMethod';
import {vec3} from 'gl-matrix';
import { KatachiConfigJson } from '../../WebGL/WebglType';
import GLTFImporter from '../AssetImporter/GLTFImporter';
import { Model } from 'webgl-gltf';

class ShapeBuilder {

    private _materialManager : MaterialManager;
    private _meshManager : MeshManager;
    private _gl : WebGLRenderingContext;
    private gltfImporter : GLTFImporter;

    constructor(gl : WebGLRenderingContext, materialManager : MaterialManager, meshManager : MeshManager) {
        this._gl = gl;
        this._materialManager = materialManager;
        this._meshManager = meshManager;
        this.gltfImporter = new GLTFImporter(gl);
    }
    
    Build(shapeName : string, mesh : Mesh, material : Material) : ShapeObject {
        let transform = new Transform(vec3.create(), vec3.create(), vec3.fromValues(1, 1, 1));
        let shapeObject : ShapeObject = new ShapeObject(transform, mesh, material);

        shapeObject.name = shapeName;
        shapeObject.id = RandomChar(11);

        let defaultMatConfig = GetDefaultMaterialConfig(this._gl);
        defaultMatConfig.attributes[DefaultVertexShaderParameter.vertex].value = mesh.meshData.vertex;
        defaultMatConfig.attributes[DefaultVertexShaderParameter.uv].value = mesh.meshData.uv;
        defaultMatConfig.attributes[DefaultVertexShaderParameter.normal].value = mesh.meshData.normal;

        material.PreloadProperties(this._gl, defaultMatConfig);

        return shapeObject;
    }

    BuildQuad() : ShapeObject {
        let mesh = this._meshManager.CreateQuad();
        let shaderSet = this._materialManager.GetGlShaderSet(GLProgramIDs.Standard);
        let material = this._materialManager.CreateMaterial(shaderSet.vertShader, shaderSet.fragShader);
        return this.Build("Quad", mesh, material);
    }

    BuildCube() : ShapeObject {
        let mesh = this._meshManager.CreateCube();
        let shaderSet = this._materialManager.GetGlShaderSet(GLProgramIDs.Standard);
        let material = this._materialManager.CreateMaterial(shaderSet.vertShader, shaderSet.fragShader);
        
        return this.Build("Cube", mesh, material);
    }

    async BuildGLTFShape(gltfID : string, gltfPath : string) : Promise<GLTFShapeObject> {
        const gltfModel = await this.gltfImporter.LoadAsset(gltfPath);

        console.log(gltfModel);
        const gltfmesh = gltfModel.meshes[0];

        let fakeMesh = this._meshManager.CreateNull(gltfID);
        fakeMesh.meshData.vertexCount = gltfmesh.elementCount * 3;
        fakeMesh.meshData.glBufferIndices = gltfmesh.indices;
        fakeMesh.meshData.glBufferVertex = gltfmesh.positions.buffer;
        fakeMesh.meshData.glBufferNormal = gltfmesh.normals.buffer;
        fakeMesh.meshData.glBufferUV = gltfmesh.texCoord.buffer;

        let shaderSet = this._materialManager.GetGlShaderSet(GLProgramIDs.Standard);
        let material = this._materialManager.CreateMaterial(shaderSet.vertShader, shaderSet.fragShader);

        let transform = new Transform(vec3.create(), vec3.create(), vec3.fromValues(1, 1, 1));
        let shapeObject : GLTFShapeObject = new GLTFShapeObject(transform, fakeMesh, material, gltfModel);
        shapeObject.name = gltfModel.name;
        shapeObject.id = gltfID;

        let defaultMatConfig = GetDefaultMaterialConfig(this._gl);
        defaultMatConfig.attributes[DefaultVertexShaderParameter.vertex].value = gltfmesh.positions.buffer;
        defaultMatConfig.attributes[DefaultVertexShaderParameter.uv].value = gltfmesh.texCoord.buffer;
        defaultMatConfig.attributes[DefaultVertexShaderParameter.normal].value = gltfmesh.normals.buffer;
        defaultMatConfig.attributes[DefaultVertexShaderParameter.tangent].value = gltfmesh.tangents.buffer;

        if (gltfModel.materials.length > 0) {
            defaultMatConfig.texture[0].textureBuffer = gltfModel.materials[0].baseColorTexture; // DiffuseTex
            defaultMatConfig.texture[1].textureBuffer = gltfModel.materials[0].normalTexture; // NormalTex
        }
        shapeObject.SetCustomUniformAttr("u_mainColor", {value : [1, 1, 1, 1], isMatrix : false, function : this._gl.uniform4fv})

        material.PreloadProperties(this._gl, defaultMatConfig);

        return shapeObject
    }
}

export default ShapeBuilder;