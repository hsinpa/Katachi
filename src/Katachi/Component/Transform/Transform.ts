import {mat4, quat, vec3, vec4} from 'gl-matrix';
import {Vector, Calculation} from './TransformStatic';
import TransformVector from './TransformVector'

class Transform {
    public relativePosition : vec3;
    public relativeRotation : vec3;
    public relativeScale : vec3;
    private relativeQuaterion : quat;

    public position : vec3;
    public rotation : vec3;
    public scale : vec3;
    private quaterion : quat;

    private _modelMatrix : mat4;
    private _relativeModelMatrix : mat4;
    private _inverseTransposeMatrix : mat4;

    private _parent: Transform;
    private _children : Transform[];

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
        return this.GetModelMatrix(this.position, this.rotation, this.scale, this.quaterion, this.modelMatrix);
    }

    public get calcuateRelativeModelMatrix() {
        return this.GetModelMatrix(this.relativePosition, this.relativeRotation, this.relativeScale, this.relativeQuaterion, this._relativeModelMatrix);
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

        this.relativePosition = vec3.create();
        this.rotation = vec3.create();
        this.scale = vec3.create();
        this.quaterion = quat.create();

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

     private GetModelMatrix(position : vec3, rotation : vec3, scale : vec3, quaterion : quat, targetMotrix : mat4) {
        this.quaterion = quat.fromEuler(quaterion, rotation[0] * Calculation.Radian2Degree, rotation[1]* Calculation.Radian2Degree, rotation[2]* Calculation.Radian2Degree);
        return mat4.fromRotationTranslationScale(targetMotrix,quaterion, position, scale);
     }

    //#region  Hierachy Structure
     public UpdateChildTransform() {
        
        for (let i = 0; i < this.childCount; i++) {

        }
     }

     public UpdateTransform(parentTransform : Transform) {
        vec3.add(this.position, this.relativePosition, parentTransform.position);
        vec3.add(this.rotation, this.relativeRotation, parentTransform.rotation);
        vec3.add(this.scale, this.relativeScale, parentTransform.scale);
     }

     public UpdateRelativeTransform(parentTransform : Transform) {
        vec3.add(this.relativePosition,vec3.negate(this.relativePosition, this.position), parentTransform.position);
        vec3.add(this.relativeRotation,vec3.negate(this.relativeRotation, this.rotation), parentTransform.rotation);
        vec3.add(this.relativeScale,vec3.negate(this.relativeScale, this.scale), parentTransform.scale);
     }

     public SetParent(parentTransform : Transform) {
        if (parentTransform == null) return;

        if (this.parent != null) {
            this.parent.RemoveChildren(this);
        }

        parentTransform.AppendChild(this);
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