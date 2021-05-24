import { quat, vec3 } from "gl-matrix";


class TransformData {
    public relativePosition : vec3;
    public relativeRotation : vec3;
    public relativeScale : vec3;
    private relativeQuaterion : quat;
    
    public position : vec3;
    private _rotation : vec3;
    public scale : vec3;
    private quaterion : quat;
}