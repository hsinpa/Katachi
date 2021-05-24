import { vec3, vec4 } from 'gl-matrix';
import Transform from '../Transform/Transform';
import DirectionLight from './DirectionLight';

export default class Light {

    directionLigth : DirectionLight;
    ambient_light : vec4;
    
    constructor() {
        this.directionLigth = new DirectionLight();
        this.ambient_light = vec4.fromValues(0.3, 0.3, 0.3, 1);
    }

    public SyncLightRelativePosToCamera(cameraTransform : Transform) {
        vec3.add(this.directionLigth.cachePosition, this.directionLigth.offsetPostion, cameraTransform.position);

        this.directionLigth.transform.SetPosition(this.directionLigth.cachePosition[0], this.directionLigth.offsetPostion[1], this.directionLigth.cachePosition[2]);
    }

}