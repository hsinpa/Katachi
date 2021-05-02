import { vec3, vec4 } from 'gl-matrix';
import ObjectInterface from '../Object';

export default class DirectionLight extends ObjectInterface {
    
    color : vec4;
    ambient_light : vec4;

    constructor() {
        super(); 

        this.color = vec4.fromValues(1,1,1,1); // White light by default

        //Set default light direction in radian
        this.transform.rotation[0] = Math.PI / 4;
        this.transform.rotation[1] = Math.PI / 3;
        this.transform.rotation[2] = 0;

        this.transform.transformVector.UpdateTransformVector(this.transform.rotation);

        this.ambient_light = vec4.fromValues(0.1, 0.1, 0.1, 0);
    }
}