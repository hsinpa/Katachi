import {mat4, quat, vec3, vec4} from 'gl-matrix';
import {Vector} from './TransformStatic';
import TransformVector from './TransformVector'

class Transform {
    public position : vec3;
    public rotation : vec3;
    public scale : vec3;

    public quaterion : quat;

    private _modelMatrix : mat4;

    public get modelMatrix() {
        //this.quaterion = quat.fromEuler(this.quaterion, this.rotation[0], this.rotation[1], this.rotation[2]);
        return mat4.fromRotationTranslationScale(this._modelMatrix,this.quaterion, this.position, this.scale);
    }

    public transformVector : TransformVector;

    constructor(position : vec3, rotation : vec3, scale : vec3) {
        this.position = position;
        this.rotation = rotation;
        this.scale = scale;
        
        this.quaterion = quat.create();
        this._modelMatrix = mat4.create();
        this.transformVector = new TransformVector();
    }
}

export function CreateEmptyTransform() {
    let p = vec3.create();
    let r = vec3.create();
    let s = vec3.fromValues(1,1,1);

    return new Transform(p, r, s);
}

export default Transform;