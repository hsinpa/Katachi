import {MeshType} from '../MeshTypes';

export default function CreateQuadMesh() : MeshType{

    let vertex = GetQuadVertex();
    let color = GetColor([1,1,1,1], 6);
    let uv = GetQuadUV();

    //Front, Right, Left, Top, Bottom, Back
    let normal = GetQuadNormal();

    return {
        vertex : vertex,
        color : color,
        uv : uv,
        normal : normal,
        glUsageType : WebGLRenderingContext.STATIC_DRAW,

        nativeVertex : new Float32Array(vertex),
        nativeNormal : new Float32Array(normal),
        nativeUV : new Float32Array(uv),
        nativecolor : new Float32Array(color)
    }
}

function GetQuadVertex() : number[] {
    return [-1, -1, 0 ,1,
        -1, 1, -0 ,1,
        1, -1, 0, 1,
        1, -1, 0, 1,
        -1, 1, 0, 1,
        1, 1, 0, 1];
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

function GetColor(color : number[], vertexCount : number) {
    let normals : number[]= [];

    for (let i = 0; i < vertexCount; i++) {
        normals = normals.concat(color);
    }
    return normals;
}