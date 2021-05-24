import * as GLTFPlugin from 'webgl-gltf'
import Material from '../Material/Material';
import Mesh from '../Mesh/Mesh';
import Transform from '../Transform/Transform';
import ShapeObject from './ShapeObject';

export default class GLTFShapeObject extends ShapeObject {
    public gltfModel : GLTFPlugin.Model;

    constructor(transform : Transform, emptyMesh : Mesh, material : Material, gltfModel : GLTFPlugin.Model ) {
        super(transform, emptyMesh, material);
        this.gltfModel = gltfModel;
    }
}