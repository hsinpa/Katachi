import {mat3, mat4, quat, vec3, vec4} from 'gl-matrix';
import {Vector, Calculation, VectorType} from './TransformStatic';
import TransformVector from './TransformVector'
import {ToEulerAngles} from '../../Utility/UtilityMethod';

class Transform {
    public relativePosition : vec3;
    public relativeRotation : vec3;
    public relativeScale : vec3;
    private relativeQuaterion : quat;
    
    public position : vec3;
    private _rotation : vec3;
    public scale : vec3;
    private quaterion : quat;

    private _modelMatrix : mat4;
    private _relativeModelMatrix : mat4;
    private _preSaveRelativeModelMatrix : mat4;
    private _inverseTransposeMatrix : mat4;

    private _parent: Transform;
    private _children : Transform[];

    public get rotation() {
        return (this._rotation);
    }

    public get childCount() {
        return this.children.length;
    }

    public get children() {
        return this._children;
    }

    public get parent() {
        return this._parent;
    }

    public get calculateModelMatrix() {
       if (this._parent == null) {
            return this.GetModelMatrix(this.position, this._rotation, this.scale, this.quaterion, this._modelMatrix);
        }
        
        this.GetModelMatrix(this.relativePosition, this.relativeRotation, this.relativeScale, this.relativeQuaterion, this._relativeModelMatrix);
        mat4.mul(this._modelMatrix, this._parent.modelMatrix, this._relativeModelMatrix);

        return this._modelMatrix;
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
        this._rotation = rotation;
        this.scale = scale;
        this.quaterion = quat.create();

        this.relativePosition = vec3.create();
        this.relativeRotation = vec3.create();
        this.relativeScale = vec3.create();
        this.relativeQuaterion = quat.create();
        this._relativeModelMatrix = mat4.create();
        this._preSaveRelativeModelMatrix = mat4.create();

        this._modelMatrix = mat4.create();
        this._inverseTransposeMatrix = mat4.create();
        this.transformVector = new TransformVector();

        this._parent = null;
        this._children = [];
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

     Rotate(roll : number, pitch : number, yaw:number) {
         quat.rotateX(this.quaterion, this.quaterion, roll);
         quat.rotateY(this.quaterion, this.quaterion, pitch);
         quat.rotateZ(this.quaterion, this.quaterion, yaw);
     }

     SetEuler(x : number, y : number, z : number) {
        this._rotation[0] = x;
        this._rotation[1] = y;
        this._rotation[2] = z;
     }

     private GetModelMatrix(position : vec3, rotation : vec3, scale : vec3, quaterion : quat, targetMotrix : mat4) {
        quaterion = quat.fromEuler(quaterion, rotation[0] * Calculation.Radian2Degree, rotation[1]* Calculation.Radian2Degree, rotation[2]* Calculation.Radian2Degree);
        return mat4.fromRotationTranslationScale(targetMotrix, quaterion, position, scale);
     }

    //#region  Hierachy Structure
     public UpdateRelativeTransformByParent(parentTransform : Transform) {
        let worldModelMatrix = this.GetModelMatrix(this.position, this._rotation, this.scale, this.quaterion, this.modelMatrix);
        let inverseParentMatrix = mat4.create();

        mat4.invert(inverseParentMatrix, parentTransform.calculateModelMatrix);

        mat4.mul(this._preSaveRelativeModelMatrix, inverseParentMatrix, worldModelMatrix);

        this.relativePosition = mat4.getTranslation(this.relativePosition,this._preSaveRelativeModelMatrix);
        this.relativeQuaterion = mat4.getRotation(this.relativeQuaterion,this._preSaveRelativeModelMatrix);
        this.relativeRotation = ToEulerAngles(this.relativeQuaterion)
        this.relativeScale = mat4.getScaling(this.relativeScale,this._preSaveRelativeModelMatrix);
     }

     public SetParent(parentTransform : Transform) {
        if (parentTransform == null) return;

        if (this.parent != null) {
            this.parent.RemoveChildren(this);
        }

        this._parent = parentTransform;
        parentTransform.AppendChild(this);

        this.UpdateRelativeTransformByParent(parentTransform);
     }

     public AppendChild(targetTransform : Transform) {
        let targetIndex = this._children.findIndex(x=>x == targetTransform);

        if (targetIndex < 0)
            this._children.push(targetTransform);
     }

     public RemoveChildren(targetTransform : Transform) {
        let targetIndex = this._children.findIndex(x=>x == targetTransform);

        if (targetIndex >= 0)
            this._children.splice(targetIndex, 1);
     }
     //#endregion
}

export function CreateEmptyTransform() {
    let p = vec3.create();
    let r = vec3.create();
    let s = vec3.fromValues(1,1,1);

    return new Transform(p, r, s);
}

export default Transform;