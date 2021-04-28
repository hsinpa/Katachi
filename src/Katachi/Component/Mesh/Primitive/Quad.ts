import {MeshType} from '../MeshTypes';

export default function CreateQuadMesh() : MeshType{
    return {
        vertex : GetQuadVertex(),
        color : GetColor([1,1,1,1], 6),
        uv : GetQuadUV(),
        normal : GetQuadNormal(),
        glUsageType : WebGLRenderingContext.STATIC_DRAW
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