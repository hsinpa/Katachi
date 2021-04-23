import {mat4, vec3} from 'gl-matrix';
import ObjectInterface from '../Object';
import Transform from '../Transform';
import {RandomChar} from '../../Utility/UtilityMethod';

export enum ProjectionType {Orthographic, Perspective};

class Camera extends ObjectInterface{
    private _viewMatrix : mat4;
    private upDirMatrix : vec3;

    private _projectionMatrix: mat4;

    private projectionType : ProjectionType;

    private canvasWidth : number = 0; 
    private canvasHeight : number = 0;

    public farClipPoint : number = -10; 

    public get viewMatrix() {
        return mat4.lookAt(this._viewMatrix, this.transform.position, this.transform.rotation, this.upDirMatrix);
    }

    public get projectionMatrix() {
        return this._projectionMatrix;
    }

    constructor() {
        super();
        this.id = RandomChar(8);
        this.name = "MainCamera";

        //Look At z direction;
        this.transform.position[2] = 1;
        this.transform.rotation[2] = -1;

        this.upDirMatrix = vec3.fromValues(0, 1, 0);
        this._viewMatrix = mat4.create();
        this._projectionMatrix = mat4.create();

        this.projectionType = ProjectionType.Orthographic;
    }

    SetCanvasWidthHeight(width : number, height : number) {
        this.canvasHeight = width;
        this.canvasWidth = height;

        let aspectRatio = width / height;
        this._projectionMatrix = this.GetOrthographicMatrix(-1 * aspectRatio, 1 * aspectRatio, -1, 1, 0.3, 10);
    }

    //https://webglfundamentals.org/webgl/lessons/webgl-3d-orthographic.html
    //http://learnwebgl.brown37.net/08_projections/projections_ortho.html
    //If anyone interest in building matrix layout on their own
    GetOrthographicMatrix(left : number, right : number, bottom : number, top : number, near : number, far : number) {
        return mat4.ortho(this._projectionMatrix, left, right, bottom, top, near, far);
    }
}

export default Camera;