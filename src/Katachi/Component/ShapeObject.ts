import Transform from './Transform';
import Mesh from './Mesh/Mesh';
import Material from './Material/Material';
import {DefaultVertexShaderParameter} from './Material/MaterialTypes'


class ShapeObject {
    id : string;
    name : string;

    transform : Transform;
    mesh : Mesh;
    material : Material;

    constructor(transform : Transform, mesh : Mesh, material : Material) {
        this.transform = transform;
        this.mesh = mesh;
        this.material = material;
    }

    SetMesh(mesh : Mesh) {
        this.mesh = mesh;
    }

    SetMaterial(material : Material) {
        this.material = material;
    }

    ProcessRendertimeMaterialAttr(gl : WebGLRenderingContext) {
        this.material.ExecuteAttributeProp(gl, DefaultVertexShaderParameter.vertex, this.mesh.meshData.vertex );
        //this.material.ExecuteAttributeProp(gl, DefaultVertexShaderParameter.uv, this.mesh.meshData.uv);
    }
    
}

export default ShapeObject;