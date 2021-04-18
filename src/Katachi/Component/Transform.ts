import {Vec3} from '@thi.ng/vectors';

class Transform {
    public position : Vec3;
    public rotation : Vec3;
    public scale : Vec3;

    constructor(position : Vec3, rotation : Vec3, scale : Vec3) {
        this.position = position;
        this.rotation = rotation;
        this.scale = scale;
    }
}    

export default Transform;