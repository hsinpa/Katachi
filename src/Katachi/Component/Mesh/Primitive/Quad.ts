import {MeshType} from '../MeshTypes';

export default function CreateQuadMesh() : MeshType{
    return {
        vertex : GetQuadVertex(),
        color : [],
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