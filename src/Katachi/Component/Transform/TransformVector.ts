import {vec3} from 'gl-matrix';
import {VectorType, Vector} from './TransformStatic';

export default class TransformVector {

    private cacheTVector : VectorType;
    
    constructor() {
        this.cacheTVector = {
            forward : vec3.create(),
            right : vec3.create(),
            top : vec3.create()
        }
    }

    public UpdateTransformVector(rotation : Readonly<vec3>) {
        this.cacheTVector.forward = this.GetForward(rotation);
        this.cacheTVector.right = this.GetRight();
        this.cacheTVector.top = this.GetUp();

        return this.cacheTVector;
    }

    public GetTransformVector() {
        return this.cacheTVector;
    }

    private GetForward(rotation : Readonly<vec3>) {
        this.cacheTVector.forward[0] = Math.cos(rotation[0]) * Math.cos(rotation[1]);
        this.cacheTVector.forward[1] = Math.sin(rotation[1]);
        this.cacheTVector.forward[2] = Math.sin(rotation[0]) * Math.cos(rotation[1]);

        return this.cacheTVector.forward;
    }

    private GetRight() {
        vec3.cross(this.cacheTVector.right, Vector.top, this.cacheTVector.forward);
        return vec3.normalize(this.cacheTVector.right, this.cacheTVector.right);
    }

    private GetUp() {
        return vec3.cross(this.cacheTVector.top, this.cacheTVector.forward, this.cacheTVector.right);
    }
    
}

