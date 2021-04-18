import ShapeObject from './ShapeObject';

interface ShapeArrayType {
    [id: string] : ShapeObject
}

class Scene {

    private _shapeArray : ShapeArrayType;
    public get shapeArray() {
        return this._shapeArray;
    }

    constructor() {
        this._shapeArray = {};
    }

    public InsertShapeObj(shapeObject : ShapeObject) {
        this._shapeArray[shapeObject.id] = shapeObject;
    }

    public RemoveShapeObj(id : string) {
        delete this._shapeArray[id];
    }
}

export default Scene;