import { vec4 } from 'gl-matrix';
import DirectionLight from './DirectionLight';

export default class Light {

    directionLigth : DirectionLight;
    ambient_light : vec4;
    
    constructor() {
        this.directionLigth = new DirectionLight();
        this.ambient_light = vec4.fromValues(0.1, 0.1, 0.1, 0);
    }


}