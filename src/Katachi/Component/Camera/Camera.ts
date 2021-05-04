import {mat4, quat, vec3} from 'gl-matrix';
import ObjectInterface from '../Object';
import Transform from '../Transform/Transform';
import {RandomChar} from '../../Utility/UtilityMethod';
import {Projection, ProjectionType} from '../Projection'

class Camera extends ObjectInterface{
    
    public projection : Projection

    constructor() {
        super();
        this.id = RandomChar(8);
        this.name = "MainCamera";

        this.transform.rotation[0] = 1.5 * Math.PI;
        this.projection = new Projection(this.transform, ProjectionType.Perspective);
    }
}

export default Camera;