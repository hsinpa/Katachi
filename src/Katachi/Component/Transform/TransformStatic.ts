import { vec3 } from "gl-matrix";

type VectorStaticType = {
    readonly top : vec3,
    readonly right : vec3,
    readonly forward : vec3,
}

export type VectorType = {
    top : vec3,
    right : vec3,
    forward : vec3,
}

export const Vector : VectorStaticType = {
    top : vec3.fromValues(0,1,0),
    right : vec3.fromValues(1, 0,0),
    forward : vec3.fromValues(0, 0, 1)
}

export const Calculation = Object.freeze({
    Radian2Degree : 180 / Math.PI,
    Degree2Radian : 180 / 180 / Math.PI
});