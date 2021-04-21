import {mat4, vec3} from 'gl-matrix';
import ObjectInterface from '../Object';
import Transform from '../Transform';
import {RandomChar} from '../../Utility/UtilityMethod';

class Camera extends ObjectInterface{
    private _viewMatrix : mat4;
    private upDirMatrix : vec3;

    public get viewMatrix() {
        return mat4.lookAt(this._viewMatrix, this.transform.position, this.transform.rotation, this.upDirMatrix);
    }

    constructor() {
        super();
        this.id = RandomChar(8);
        this.name = "MainCamera";

        //Look At z direction;
        this.transform.rotation[2] = -1;
        
        this.upDirMatrix = vec3.fromValues(0, 1, 0);
        this._viewMatrix = mat4.create();
    }
}

export default Camera;