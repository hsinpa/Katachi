import { vec3 } from 'gl-matrix';
import Camera from './Camera/Camera';
import ShapeObject from './Shape/ShapeObject';

interface ShapeArrayType {
    [id: string] : ShapeObject
}

class Scene {

    private _shapeArray : ShapeArrayType;

    public camera : Camera;

    public get shapeArray() {
        return this._shapeArray;
    }

    constructor() {
        this._shapeArray = {};

        this.camera = new Camera();
    }

    public InsertShapeObj(shapeObject : ShapeObject) {
        this._shapeArray[shapeObject.id] = shapeObject;
    }

    public RemoveShapeObj(id : string) {
        delete this._shapeArray[id];
    }
}

export default Scene;