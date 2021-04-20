import Transform from './Transform';
import Mesh from './Mesh/Mesh';
import Material from './Material/Material';
import {DefaultVertexShaderParameter, UniformProperties} from './Material/MaterialTypes'

class ShapeObject {
    id : string;
    name : string;

    transform : Transform;
    mesh : Mesh;
    material : Material;

    matUniformAttributes : UniformProperties;

    constructor(transform : Transform, mesh : Mesh, material : Material) {
        this.transform = transform;
        this.mesh = mesh;
        this.material = material;

        this.matUniformAttributes = {};
    }

    SetMesh(mesh : Mesh) {
        this.mesh = mesh;
    }

    SetMaterial(material : Material) {
        this.material = material;
    }

    SetCustomUniformAttr(matUniformAttributes : UniformProperties) {
        this.matUniformAttributes = matUniformAttributes;
    }
    
//#region Process During render time
    ProcessMaterialAttr(gl : WebGLRenderingContext) {
        this.material.ExecuteAttributeProp(gl, DefaultVertexShaderParameter.vertex );
        this.material.ExecuteAttributeProp(gl, DefaultVertexShaderParameter.color );
        this.material.ExecuteAttributeProp(gl, DefaultVertexShaderParameter.uv );
        this.material.ExecuteAttributeProp(gl, DefaultVertexShaderParameter.normal );    
    }

    ProcessMaterialUnifrom(gl : WebGLRenderingContext, time : number) {
        //Default System attr, color and time
        this.material.ExecuteUniformProp(DefaultVertexShaderParameter.time, time, gl.uniform1f.bind(gl));

        gl.uniform2iv

        //Custom uniform, define by external user
        Object.keys(this.matUniformAttributes).forEach(key => {
            this.material.ExecuteUniformProp(key, this.matUniformAttributes[key].value, this.matUniformAttributes[key].function.bind(gl));
        });
    }

//#endregion
}

export default ShapeObject;