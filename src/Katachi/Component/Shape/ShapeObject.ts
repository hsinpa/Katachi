import Transform from '../Transform/Transform';
import Mesh from '../Mesh/Mesh';
import Material from '../Material/Material';
import {DefaultVertexShaderParameter, UniformProperties, UniformAttrType, GLUniformTextures} from '../Material/MaterialTypes'
import ObjectInterface from '../Object';
import Camera from '../Camera/Camera';
import { mat4, vec2 } from 'gl-matrix';
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
        let MV = mat4.mul(this.modelViewProjectionMatrix, viewMatrixFromCamera, this.transform.modelMatrix);

        return mat4.mul(this.modelViewProjectionMatrix, projectionMatrix, MV);
    }
    
//#region Process During render time
    ProcessMaterialAttr(gl : WebGLRenderingContext, material : Material) {
        material.ExecuteAttributeProp(gl, DefaultVertexShaderParameter.vertex, this.mesh.meshData.nativeVertex );
        material.ExecuteAttributeProp(gl, DefaultVertexShaderParameter.color, this.mesh.meshData.nativecolor );
        material.ExecuteAttributeProp(gl, DefaultVertexShaderParameter.uv, this.mesh.meshData.nativeUV );
        material.ExecuteAttributeProp(gl, DefaultVertexShaderParameter.normal, this.mesh.meshData.nativeNormal );    
    }

    ProcessMaterialUniform(gl : WebGLRenderingContext, material : Material, time : number, worldMatrix : mat4, modelInverseTMatrix  : mat4, mvpMatrix : mat4, light: Light,
        depthTexture : WebGLTexture, depthTextureTexel : vec2) {
        //Default System attr, color and time
        material.ExecuteUniformProp(DefaultVertexShaderParameter.time, time, gl.uniform1f.bind(gl));
        material.ExecuteUniformProp(DefaultVertexShaderParameter.modelMatrix, worldMatrix, gl.uniformMatrix4fv.bind(gl), true);
        material.ExecuteUniformProp(DefaultVertexShaderParameter.inverseTransposeModelMatrix, modelInverseTMatrix, gl.uniformMatrix4fv.bind(gl), true);
        material.ExecuteUniformProp(DefaultVertexShaderParameter.modelViewProjectionMatrix, mvpMatrix, gl.uniformMatrix4fv.bind(gl), true);

        //Might be null, if user remove it
        if (light != null) {
            material.ExecuteUniformProp(DefaultVertexShaderParameter.directionLightDir, light.directionLigth.transform.transformVector.GetTransformVector().forward, gl.uniform3fv.bind(gl));
            material.ExecuteUniformProp(DefaultVertexShaderParameter.directionLightColor, light.directionLigth.color, gl.uniform4fv.bind(gl));    

            material.ExecuteUniformProp(DefaultVertexShaderParameter.lightSpaceMVPMatrix, light.directionLigth.projection.spaceMatrix, gl.uniformMatrix4fv.bind(gl), true);
            material.ExecuteUniformProp(DefaultVertexShaderParameter.ambientLightColor, light.ambient_light, gl.uniform4fv.bind(gl));    
        }

        if (depthTexture != null) {
            material.ExecuteUniformTex(gl, DefaultVertexShaderParameter.depthMapTexture, depthTexture);    
            material.ExecuteUniformProp(DefaultVertexShaderParameter.depthMapTex_Texel, depthTextureTexel, gl.uniform2fv.bind(gl));    

            //Custom uniform, define by external user
            Object.keys(this.matUniformAttributes).forEach(key => {
                if (this.matUniformAttributes[key].value instanceof HTMLImageElement) {
                    let htmlSprite = this.matUniformAttributes[key].value as HTMLImageElement;

                    material.ExecuteUniformSprite(gl, key, this.matUniformAttributes[key].value); 
                    material.ExecuteUniformProp(DefaultVertexShaderParameter.mainTex_Texel, vec2.fromValues(1 / htmlSprite.width, 1 / htmlSprite.height), gl.uniform2fv.bind(gl));    
                } else {
                    material.ExecuteUniformProp(key, this.matUniformAttributes[key].value, this.matUniformAttributes[key].function.bind(gl), this.matUniformAttributes[key].isMatrix);
                }
            });
    
            //Empty all custom uniform config
            this.matUniformAttributes = {};        
        }
    }

//#endregion
}

export default ShapeObject;