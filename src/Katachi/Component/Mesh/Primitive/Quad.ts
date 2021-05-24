import {MeshType} from '../MeshTypes';

export default function CreateQuadMesh() : MeshType{

    let vertex = GetQuadVertex();
    let uv = GetQuadUV();

    //Front, Right, Left, Top, Bottom, Back
    let normal = GetQuadNormal();
    let tangent = GetQuadTangent();

    return {
        vertex : vertex,
        uv : uv,
        normal : normal,
        tangent : tangent,
        glUsageType : WebGLRenderingContext.STATIC_DRAW,

        nativeVertex : new Float32Array(vertex),
        nativeNormal : new Float32Array(normal),
        nativeUV : new Float32Array(uv),
        nativeTangent : new Float32Array(tangent),

        vertexCount : vertex.length,
        glBufferIndices : null,
        glBufferVertex:null,
        glBufferNormal:null,
        glBufferTangent : null,
        glBufferUV:null
    }
}

function GetQuadVertex() : number[] {
    return [-1, -1, 0,
        -1, 1, 0,
        1, -1, 0,
        1, -1, 0,
        -1, 1, 0,
        1, 1, 0];
}

function GetQuadUV() : number[] {
    return [0, 0,
        0, 1,
        1, 0,
        1, 0,
        0, 1,
        1, 1];
}

function GetQuadNormal() : number[] {
    return [0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1];
}

function GetQuadTangent() : number[] {
    return [0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0];
}

function GetColor(color : number[], vertexCount : number) {
    let normals : number[]= [];

    for (let i = 0; i < vertexCount; i++) {
        normals = normals.concat(color);
    }
    return normals;
}