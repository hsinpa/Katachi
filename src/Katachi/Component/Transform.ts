import {mat4, vec3, vec4} from 'gl-matrix';

class Transform {
    public position : vec3;
    public rotation : vec3;
    public scale : vec3;

    constructor(position : vec3, rotation : vec3, scale : vec3) {
        this.position = position;
        this.rotation = rotation;
        this.scale = scale;
    }
}    

export default Transform;