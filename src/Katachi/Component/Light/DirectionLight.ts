import { vec3, vec4 } from 'gl-matrix';
import ObjectInterface from '../Object';
import {Projection, ProjectionType} from '../Projection';

export default class DirectionLight extends ObjectInterface {
    
    color : vec4;
    projection : Projection;

    offsetPostion : vec3;

    constructor() {
        super(); 

        this.color = vec4.fromValues(1,1,1,1); // White light by default

        //Set Default position
        this.offsetPostion = vec3.fromValues(3, 9, 3);

        //Set default light direction in radian
        this.transform.rotation[0] = Math.PI * 0.3;
        this.transform.rotation[1] = Math.PI * 1.35;
        this.transform.rotation[2] = 0;

        this.transform.transformVector.UpdateTransformVector(this.transform.rotation);

        this.projection = new Projection(this.transform, ProjectionType.Orthographic);

        this.projection.sizeOrtho = 5;
    }
}