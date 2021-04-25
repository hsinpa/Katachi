import { vec3 } from 'gl-matrix';
import Transform, {CreateEmptyTransform} from './Transform/Transform';

export default class ObjectBase {
    id : string = "";
    name : string = "NoName";
    transform : Transform;

    constructor() {
        this.transform = CreateEmptyTransform();
    }

    SetPosition() {
        
    }

    Scale(n : number) {
       vec3.scale(this.transform.scale, this.transform.scale, n); 
    }

    Translate(x : number, y : number, z : number) {
        this.transform.position[0] += this.transform.forward[0] * x;
        this.transform.position[1] += this.transform.forward[1] * y;
        this.transform.position[2] += this.transform.forward[2] * z;
    }
}