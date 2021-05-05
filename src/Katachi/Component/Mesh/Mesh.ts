import {MeshType} from './MeshTypes';

class Mesh {
    private _meshData : MeshType;

    public get vertCount() {
        return Math.round(this._meshData.vertex.length / 4);
    }

    public get meshData() {
        return this._meshData;
    }
    
    constructor(meshData : MeshType) {
        this._meshData = meshData;
    }

    public SetVertex(vertex : number[]) {
        this._meshData.vertex = vertex;
        this._meshData.nativeVertex = new Float32Array(vertex);
    }

    public SetColor(color : number[]) {
        this._meshData.color = color;
        this._meshData.nativecolor = new Float32Array(color);
    }

    //Vector2
    public SetUV(uv : number[]) {
        this._meshData.uv = uv;
        this._meshData.nativeUV = new Float32Array(uv);
    }

    //Vector3
    public SetNormal(normal : number[]) {
        this._meshData.normal = normal;
        this._meshData.nativeNormal = new Float32Array(normal);
    }    
}

export default Mesh;