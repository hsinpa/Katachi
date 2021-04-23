import Transform from '../Transform';
import Mesh from '../Mesh/Mesh';
import Material from '../Material/Material';
import {DefaultVertexShaderParameter, UniformProperties} from '../Material/MaterialTypes'
import ObjectInterface from '../Object';
import Camera from '../Camera/Camera';
import { mat4 } from 'gl-matrix';

class ShapeObject extends ObjectInterface {    
    mesh : Mesh;
    material : Material;

    matUniformAttributes : UniformProperties;

    private modelViewProjectionMatrix : mat4;

    constructor(transform : Transform, mesh : Mesh, material : Material) {
        super();
        this.transform = transform;
        this.mesh = mesh;
        this.material = material;

        this.modelViewProjectionMatrix = mat4.create();
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

    /**
     * Get Model View Projection Matrix for Vertex shader computaiton
     *
     * @private
     * @param {mat4} cameraViewMatrix
     * @returns
     * @memberof ShapeObject
     */
    GetMVPMatrix(viewMatrixFromCamera : mat4, projectionMatrix : mat4) {
        let MV = mat4.mul(this.modelViewProjectionMatrix, viewMatrixFromCamera, this.transform.modelMatrix);

        return mat4.mul(this.modelViewProjectionMatrix, projectionMatrix, MV);
    }
    
//#region Process During render time
    ProcessMaterialAttr(gl : WebGLRenderingContext) {
        this.material.ExecuteAttributeProp(gl, DefaultVertexShaderParameter.vertex );
        this.material.ExecuteAttributeProp(gl, DefaultVertexShaderParameter.color );
        this.material.ExecuteAttributeProp(gl, DefaultVertexShaderParameter.uv );
        this.material.ExecuteAttributeProp(gl, DefaultVertexShaderParameter.normal );    
    }

    ProcessMaterialUnifrom(gl : WebGLRenderingContext, time : number, mvpMatrix : mat4) {
        //Default System attr, color and time
        this.material.ExecuteUniformProp(DefaultVertexShaderParameter.time, time, gl.uniform1f.bind(gl));
        this.material.ExecuteUniformProp(DefaultVertexShaderParameter.worldPosition, this.transform.position, gl.uniform3fv.bind(gl));
        this.material.ExecuteUniformProp(DefaultVertexShaderParameter.modelViewProjectionMatrix, mvpMatrix, gl.uniformMatrix4fv.bind(gl));

        //Custom uniform, define by external user
        Object.keys(this.matUniformAttributes).forEach(key => {
            this.material.ExecuteUniformProp(key, this.matUniformAttributes[key].value, this.matUniformAttributes[key].function.bind(gl));
        });
    }

//#endregion
}

export default ShapeObject;