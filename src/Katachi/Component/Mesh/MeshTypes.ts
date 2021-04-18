export interface MeshType {
    vertex : number[]; //Vector4
    color : number[]; //Vector4, Normalize into 0-1
    uv : number[]; //Vector2
    normal : number[]; //Vector3
    
    glUsageType : number; //ex: gl.STATIC_DRAW
}