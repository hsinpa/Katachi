import { vec3 } from 'gl-matrix';
import Camera from './Camera/Camera';
import DirectionLight from './Light/DirectionLight';
import Light from './Light/Light';

import ShapeObject from './Shape/ShapeObject';

interface ShapeArrayType {
    [id: string] : ShapeObject
}

class Scene {

    private _shapeArray : ShapeArrayType;

    public camera : Camera;
    public lights : Light;

    public get shapeArray() {
        return this._shapeArray;
    }

    constructor() {
        this._shapeArray = {};

        this.camera = new Camera();
        this.lights = new Light();
    }

    public InsertShapeObj(shapeObject : ShapeObject) {
        this._shapeArray[shapeObject.id] = shapeObject;
    }

    public RemoveShapeObj(id : string) {
        delete this._shapeArray[id];
    }
}

export default Scene;