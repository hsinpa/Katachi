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
    }

    public SetColor(color : number[]) {
        this._meshData.color = color;
    }

    //Vector2
    public SetUV(uv : number[]) {
        this._meshData.uv = uv;
    }

    //Vector3
    public SetNormal(normal : number[]) {
        this._meshData.normal = normal;
    }
    
}

export default Mesh;