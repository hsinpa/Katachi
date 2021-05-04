import Transform from '../Transform/Transform';
import Mesh from '../Mesh/Mesh';
import Material from '../Material/Material';
import {DefaultVertexShaderParameter, UniformProperties, UniformAttrType, GLUniformTextures} from '../Material/MaterialTypes'
import ObjectInterface from '../Object';
import Camera from '../Camera/Camera';
import { mat4 } from 'gl-matrix';
import WebglResource from '../../WebGL/WebglResource';
import DirectionLight from '../Light/DirectionLight';
import Light from '../Light/Light';

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

    SetCustomUniformAttrs(matUniformAttributes : UniformProperties) {
        this.matUniformAttributes = matUniformAttributes;
    }

    SetCustomUniformAttr(material_name : string, matUniformAttributes : UniformAttrType) {
        this.matUniformAttributes[material_name] = matUniformAttributes;
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
        let MV = mat4.mul(this.modelViewProjectionMatrix, viewMatrixFromCamera, this.transform.calculateModelMatrix);

        return mat4.mul(this.modelViewProjectionMatrix, projectionMatrix, MV);
    }
    
//#region Process During render time
    ProcessMaterialAttr(gl : WebGLRenderingContext) {
        this.material.ExecuteAttributeProp(gl, DefaultVertexShaderParameter.vertex );
        this.material.ExecuteAttributeProp(gl, DefaultVertexShaderParameter.color );
        this.material.ExecuteAttributeProp(gl, DefaultVertexShaderParameter.uv );
        this.material.ExecuteAttributeProp(gl, DefaultVertexShaderParameter.normal );    
    }

    ProcessMaterialUniform(gl : WebGLRenderingContext, time : number, worldMatrix : mat4, modelInverseTMatrix  : mat4, mvpMatrix : mat4, light: Light,
        depthTexture : WebGLTexture) {
        //Default System attr, color and time
        this.material.ExecuteUniformProp(DefaultVertexShaderParameter.time, time, gl.uniform1f.bind(gl));
        this.material.ExecuteUniformProp(DefaultVertexShaderParameter.modelMatrix, worldMatrix, gl.uniformMatrix4fv.bind(gl), true);
        this.material.ExecuteUniformProp(DefaultVertexShaderParameter.inverseTransposeModelMatrix, modelInverseTMatrix, gl.uniformMatrix4fv.bind(gl), true);
        this.material.ExecuteUniformProp(DefaultVertexShaderParameter.modelViewProjectionMatrix, mvpMatrix, gl.uniformMatrix4fv.bind(gl), true);

        //Might be null, if user remove it
        if (light != null) {
            this.material.ExecuteUniformProp(DefaultVertexShaderParameter.directionLightDir, light.directionLigth.transform.transformVector.GetTransformVector().forward, gl.uniform3fv.bind(gl));
            this.material.ExecuteUniformProp(DefaultVertexShaderParameter.directionLightColor, light.directionLigth.color, gl.uniform4fv.bind(gl));    
            this.material.ExecuteUniformProp(DefaultVertexShaderParameter.ambientLightColor, light.ambient_light, gl.uniform4fv.bind(gl));    
        }

        if (depthTexture != null) {

            this.material.ExecuteUniformTex(gl, DefaultVertexShaderParameter.depthMapTexture);    

        }

        //Custom uniform, define by external user
        Object.keys(this.matUniformAttributes).forEach(key => {
            if (this.matUniformAttributes[key].value instanceof HTMLImageElement) {
                this.material.ExecuteUniformSprite(gl, key, this.matUniformAttributes[key].value);    
            } else {
                this.material.ExecuteUniformProp(key, this.matUniformAttributes[key].value, this.matUniformAttributes[key].function.bind(gl), this.matUniformAttributes[key].isMatrix);
            }
        });

        //Empty all custom uniform config
        this.matUniformAttributes = {};
    }

//#endregion
}

export default ShapeObject;