import {mat4, quat, vec3, vec4} from 'gl-matrix';
import {Vector} from './TransformStatic';
import TransformVector from './TransformVector'

class Transform {
    public position : vec3;
    public rotation : vec3;
    public scale : vec3;

    public quaterion : quat;

    private _modelMatrix : mat4;
    private _inverseTransposeMatrix : mat4;

    public get calculateModelMatrix() {
        let degreeRatio = 180 / Math.PI;

        this.quaterion = quat.fromEuler(this.quaterion, this.rotation[0] * degreeRatio, this.rotation[1]* degreeRatio, this.rotation[2]* degreeRatio);
        return mat4.fromRotationTranslationScale(this._modelMatrix,this.quaterion, this.position, this.scale);
    }

    public get InverseTransposeMatrix() {
        mat4.invert(this._inverseTransposeMatrix, this._modelMatrix);
        mat4.transpose(this._inverseTransposeMatrix, this._inverseTransposeMatrix);
        return this._inverseTransposeMatrix;
    }

    public get modelMatrix() {
        return this._modelMatrix;
    }

    public transformVector : TransformVector;

    private translateVector : vec3 = vec3.create();
    private translateVectorX : vec3 = vec3.create();
    private translateVectorY : vec3 = vec3.create();
    private translateVectorZ : vec3 = vec3.create();

    constructor(position : vec3, rotation : vec3, scale : vec3) {
        this.position = position;
        this.rotation = rotation;
        this.scale = scale;
        
        this.quaterion = quat.create();
        this._modelMatrix = mat4.create();
        this._inverseTransposeMatrix = mat4.create();
        this.transformVector = new TransformVector();
    }


    Scale(n : number) {
        vec3.scale(this.scale, this.scale, n); 
     }
 
     Translate(x : number, y : number, z : number) {
         let transformVector = this.transformVector.UpdateTransformVector(this.rotation);
 
         vec3.scale(this.translateVectorX, transformVector.right, x);
         vec3.scale(this.translateVectorY, transformVector.top, y);
         vec3.scale(this.translateVectorZ, transformVector.forward, z);
 
         vec3.add(this.translateVector, this.translateVectorX, this.translateVectorY);
         vec3.add(this.translateVector, this.translateVector, this.translateVectorZ);
 
         vec3.add(this.position, this.position, this.translateVector);
     }
}

export function CreateEmptyTransform() {
    let p = vec3.create();
    let r = vec3.create();
    let s = vec3.fromValues(1,1,1);

    return new Transform(p, r, s);
}

export default Transform;