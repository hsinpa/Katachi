export interface MeshType {
    vertex : number[]; //Vector3
    uv : number[]; //Vector2
    normal : number[]; //Vector3
    tangent : number[]; //Vector4

    glUsageType : number; //ex: gl.STATIC_DRAW

    nativeVertex : Float32Array;
    nativeUV : Float32Array;
    nativeNormal : Float32Array;
    nativeTangent : Float32Array;

    glBufferIndices : WebGLBuffer,
    glBufferVertex : WebGLBuffer,
    glBufferUV : WebGLBuffer,
    glBufferNormal : WebGLBuffer,
    glBufferTangent : WebGLBuffer,

    vertexCount : number;
}