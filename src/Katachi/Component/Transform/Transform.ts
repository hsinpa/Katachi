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
            return this.GetModelMatrix(this.position, this.scale, this.quaterion, this._modelMatrix);
        }
        
        this.GetModelMatrix(this.relativePosition, this.relativeScale, this.relativeQuaterion, this._relativeModelMatrix);
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
        quat.fromEuler(this.quaterion, rotation[0], rotation[1], rotation[2]);

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

    private GetModelMatrix(position : vec3, scale : vec3, quaterion : quat, targetMotrix : mat4) {
        //quaterion = quat.fromEuler(quaterion, rotation[0] * Calculation.Radian2Degree, rotation[1]* Calculation.Radian2Degree, rotation[2]* Calculation.Radian2Degree);
        return mat4.fromRotationTranslationScale(targetMotrix, quaterion, position, scale);
    }

//#region Transform Operation
    public Scale(n : number) {
        if (this.parent == null)
            vec3.scale(this.scale, this.scale, n); 
        else
            vec3.scale(this.relativeScale, this.relativeScale, n); 
    }

    public Translate(x : number, y : number, z : number) {
        if (this.parent == null)
            this.ExecuteTranslate(x, y, z, this.rotation, this.position);
        else
            this.ExecuteTranslate(x, y, z, this.relativeRotation, this.relativePosition);
    }

    public SetPosition(x : number, y : number, z : number) {
        if (this.parent == null)
            vec3.set(this.position, x, y, z);
        else
            vec3.set(this.relativePosition, x, y, z);
    }

    private ExecuteTranslate(x : number, y : number, z : number, rotation : vec3, position : vec3) {
         let transformVector = this.transformVector.UpdateTransformVector(rotation);
 
         vec3.scale(this.translateVectorX, transformVector.right, x);
         vec3.scale(this.translateVectorY, transformVector.top, y);
         vec3.scale(this.translateVectorZ, transformVector.forward, z);
 
         vec3.add(this.translateVector, this.translateVectorX, this.translateVectorY);
         vec3.add(this.translateVector, this.translateVector, this.translateVectorZ);
 
         vec3.add(position, position, this.translateVector);
    }

    Rotate(roll : number, pitch : number, yaw:number) {
        if (this.parent == null)
            this.ExecuteRotate(roll, pitch, yaw, this.quaterion);
        else
            this.ExecuteRotate(roll, pitch, yaw, this.relativeQuaterion);
    }

    SetEuler(x : number, y : number, z : number) {
        if (this.parent == null)
            this.ExecuteEuler(x,y,z, this.quaterion, this._rotation);
        else
            this.ExecuteEuler(x,y,z, this.relativeQuaterion, this.relativeRotation);
    }

    private ExecuteRotate(roll : number, pitch : number, yaw:number, quaterion : quat) {
        quat.rotateX(quaterion, quaterion, roll);
        quat.rotateY(quaterion, quaterion, pitch);
        quat.rotateZ(quaterion, quaterion, yaw);
    }

    private ExecuteEuler(x : number, y : number, z : number, quaterion : quat, rotation : vec3) {
        rotation[0] = x;
        rotation[1] = y;
        rotation[2] = z;
        quat.fromEuler(quaterion, x, y, z);
    }
//#endregion

//#region  Hierachy Structure
    public UpdateRelativeTransformByParent(parentTransform : Transform) {
        if (parentTransform == null) {
            this.SetTransformByMatrix(this.position, this.quaterion, this.rotation, this.scale, this._modelMatrix);
            return;
        }

        let worldModelMatrix = this.GetModelMatrix(this.position, this.scale, this.quaterion, this.modelMatrix);
        let inverseParentMatrix = mat4.create();

        mat4.invert(inverseParentMatrix, parentTransform.calculateModelMatrix);

        mat4.mul(this._preSaveRelativeModelMatrix, inverseParentMatrix, worldModelMatrix);

        this.SetTransformByMatrix(this.relativePosition, this.relativeQuaterion, this.relativeRotation, this.relativeScale, this._preSaveRelativeModelMatrix);
    }

    private SetTransformByMatrix(position : vec3, quaterion : quat, rotaion:vec3, scale :vec3, matrix : mat4 ) {
        position = mat4.getTranslation(position, matrix);
        quaterion = mat4.getRotation(quaterion, matrix);
        rotaion = ToEulerAngles(quaterion)
        scale = mat4.getScaling(scale, matrix);
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