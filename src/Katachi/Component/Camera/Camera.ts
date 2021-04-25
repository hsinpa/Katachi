import {mat4, quat, vec3} from 'gl-matrix';
import ObjectInterface from '../Object';
import Transform from '../Transform/Transform';
import {RandomChar} from '../../Utility/UtilityMethod';

export enum ProjectionType {Orthographic, Perspective};

class Camera extends ObjectInterface{
    private _viewMatrix : mat4;
    private upDirMatrix : vec3;

    private _projectionMatrix: mat4;

    private _projectionType : ProjectionType;

    private canvasWidth : number = 0; 
    private canvasHeight : number = 0;

    public farClipPoint : number = 10;
    public nearClipPoint : number = 0.3;

    private aspectRatio : number;
    private _foxy : number = 120;
    private lookUpPoint : vec3;


    public set foxy(n : number) {
        this._foxy = n;
    }

    public set projectionType(t : ProjectionType) {
        this._projectionType = t;
        this.UpdateProjectionMatrix();
    }

    public get viewMatrix() {

        //vec3.add(this.lookUpPoint, this.transform.position, this.transform.forward);
        //console.log(this.lookUpPoint);
        return mat4.lookAt(this._viewMatrix, this.transform.position, this.lookUpPoint, this.upDirMatrix);
    }

    public get projectionMatrix() {
        return this._projectionMatrix;
    }

    constructor() {
        super();
        this.id = RandomChar(8);
        this.name = "MainCamera";

        //Look At z direction;
        this.lookUpPoint = vec3.create();

        this.transform.rotation[0] = 1.5 * Math.PI;
        this.upDirMatrix = vec3.fromValues(0, 1, 0);
        this._viewMatrix = mat4.create();
        this._projectionMatrix = mat4.create();

        this._projectionType = ProjectionType.Orthographic;
    }

    SetCanvasWidthHeight(width : number, height : number) {
        this.canvasHeight = height;
        this.canvasWidth = width;

        this.UpdateProjectionMatrix();
    }

    UpdateProjectionMatrix() {
        this.aspectRatio = this.canvasWidth / this.canvasHeight;
        let size = 3;

        if (this._projectionType == ProjectionType.Orthographic) 
            this._projectionMatrix = this.GetOrthographicMatrix(-size * this.aspectRatio, size * this.aspectRatio, -size, size, this.nearClipPoint, this.farClipPoint);
        else 
            this._projectionMatrix = this. GetPerspectiveMatrix(this._foxy, this.aspectRatio, this.nearClipPoint, this.farClipPoint);
    }

    //https://webglfundamentals.org/webgl/lessons/webgl-3d-orthographic.html
    //http://learnwebgl.brown37.net/08_projections/projections_ortho.html
    //If anyone interest in building matrix layout on their own
    private GetOrthographicMatrix(left : number, right : number, bottom : number, top : number, near : number, far : number) {
        return mat4.ortho(this._projectionMatrix, left, right, bottom, top, near, far);
    }

    //http://learnwebgl.brown37.net/08_projections/projections_perspective.html
    private GetPerspectiveMatrix(foxy : number, aspectRatio : number, near : number, far : number) {

        //Convert to radian
        foxy = foxy * (Math.PI / 180 );

        return mat4.perspective(this._projectionMatrix, foxy, aspectRatio, near, far);
    }
}

export default Camera;