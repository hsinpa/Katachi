import { vec3 } from 'gl-matrix';
import Camera from './Camera/Camera';
import DirectionLight from './Light/DirectionLight';
import Light from './Light/Light';

import ShapeObject from './Shape/ShapeObject';


class Scene {

    private _shapeArray : ShapeObject[];

    public camera : Camera;
    public lights : Light;

    public get shapeArray() {
        return this._shapeArray;
    }

    constructor() {
        this._shapeArray = [];

        this.camera = new Camera();
        this.lights = new Light();
    }

    public AddShapeObj(shapeObject : ShapeObject) {
        this._shapeArray.push(shapeObject);
    }

    public RemoveShapeObj(id : string) {
        let index = this._shapeArray.findIndex(x=>x.id = id);

        if (index >= 0)
            this._shapeArray.splice(index, 1);
    }

    public SetParent(parentObject : ShapeObject, childObject : ShapeObject) {
        childObject.transform.SetParent(parentObject.transform);

        if (parentObject == null) return;

        let parentIndex = this._shapeArray.findIndex(x=>x.id == parentObject.id);
            
        if (parentIndex >= 0) {
            this.RemoveShapeObj(childObject.id);

            //Insert child behind parent
            this._shapeArray.splice(parentIndex + 1, 0, childObject);
        }
    }
}

export default Scene;