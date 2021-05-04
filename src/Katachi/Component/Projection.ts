import { mat4, vec3 } from 'gl-matrix';
import Transform from './Transform/Transform';

export enum ProjectionType {Orthographic, Perspective};

export class Projection {

    private transform : Transform;

    private _viewMatrix : mat4;
    private upDirMatrix : vec3;

    private _projectionMatrix: mat4;
    private _projectionType : ProjectionType;

    public farClipPoint : number = 10;
    public nearClipPoint : number = 0.3;

    private lookUpPoint : vec3;

    private _aspectRatio : number;
    private _foxyPerspective : number = 60;
    private _sizeOrtho : number = 3;

    public get projectionMatrix() {
        return this._projectionMatrix;
    }
 
    public get viewMatrix() {
        let v = this.transform.transformVector.UpdateTransformVector(this.transform.rotation);

        vec3.add(this.lookUpPoint, this.transform.position, v.forward);
        //console.log(this.lookUpPoint);
        return mat4.lookAt(this._viewMatrix, this.transform.position, this.lookUpPoint, this.upDirMatrix);
    }

    public set projectionType(t : ProjectionType) {
        this._projectionType = t;
        this.UpdateProjectionMatrix();
    }

    public set aspectRatio(aspect : number) {
        this._aspectRatio = aspect;
        this.UpdateProjectionMatrix();
    }

    public set sizeOrtho(size : number) {
        this._sizeOrtho = size;
        this.UpdateProjectionMatrix();
    }

    public set foxyPerspective(foxy : number) {
        this._foxyPerspective = foxy;
        this.UpdateProjectionMatrix();
    }

    constructor(transform : Transform, projectionType : ProjectionType) {
        this.transform = transform;

        this.lookUpPoint = vec3.create();

        this.upDirMatrix = vec3.fromValues(0, 1, 0);
        this._viewMatrix = mat4.create();
        this._projectionMatrix = mat4.create();

        this.projectionType = projectionType;
    }

    UpdateProjectionMatrix() {
        if (this._projectionType == ProjectionType.Orthographic) 
            this._projectionMatrix = this.GetOrthographicMatrix(-this._sizeOrtho * this._aspectRatio, this._sizeOrtho * this._aspectRatio, -this._sizeOrtho, this._sizeOrtho, this.nearClipPoint, this.farClipPoint);
        else 
            this._projectionMatrix = this. GetPerspectiveMatrix(this._foxyPerspective, this._aspectRatio, this.nearClipPoint, this.farClipPoint);
        
        return this._projectionMatrix;
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