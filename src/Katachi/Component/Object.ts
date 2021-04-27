import { vec3 } from 'gl-matrix';
import Transform, {CreateEmptyTransform} from './Transform/Transform';

export default class ObjectBase {
    id : string = "";
    name : string = "NoName";
    transform : Transform;

    private translateVector : vec3 = vec3.create();
    private translateVectorX : vec3 = vec3.create();
    private translateVectorY : vec3 = vec3.create();
    private translateVectorZ : vec3 = vec3.create();

    constructor() {
        this.transform = CreateEmptyTransform();
    }

    SetPosition() {
        
    }

    Scale(n : number) {
       vec3.scale(this.transform.scale, this.transform.scale, n); 
    }

    Translate(x : number, y : number, z : number) {
        let transformVector = this.transform.transformVector.UpdateTransformVector(this.transform.rotation);

        vec3.scale(this.translateVectorX, transformVector.right, x);
        vec3.scale(this.translateVectorY, transformVector.top, y);
        vec3.scale(this.translateVectorZ, transformVector.forward, z);

        vec3.add(this.translateVector, this.translateVectorX, this.translateVectorY);
        vec3.add(this.translateVector, this.translateVector, this.translateVectorZ);

        vec3.add(this.transform.position, this.transform.position, this.translateVector);
    }
}