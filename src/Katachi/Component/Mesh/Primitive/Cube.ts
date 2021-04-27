import {MeshType} from '../MeshTypes';

export default function CreateQuadMesh() : MeshType{
    return {
        vertex : GetCubeVertex(),
        color : [],
        uv : GetCubeUV(6),

        //Front, Right, Left, Top, Bottom, Back
        normal : GetCubeNormal([0, 0, 1], [1, 0, 0],  [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0,0,-1]),
        glUsageType : WebGLRenderingContext.STATIC_DRAW
    }
}

function GetCubeVertex() : number[] {
    return [
        //Front
        -1, -1, 1 ,1,
        -1, 1, 1 ,1,
        1, -1, 1, 1,
        1, -1, 1, 1,
        -1, 1, 1, 1,
        1, 1, 1, 1,
    
        //Right
        1, -1, 1 ,1,
        1, 1, 1 ,1,
        1, -1, -1, 1,
        1, -1, -1, 1,
        1, 1, 1, 1,
        1, 1, -1, 1,

        //Left
        -1, -1, 1 ,1,
        -1, 1, 1 ,1,
        -1, -1, -1 ,1,
        -1, -1, -1 ,1,
        -1, 1, 1 ,1,
        -1, 1, -1 ,1,

        //Top
        -1, 1, 1, 1,
        -1, 1, -1, 1,
        1, 1, 1 ,1,
        1, 1, 1, 1,
        -1, 1, -1, 1,
        1, 1, -1, 1,

        //Bottom
        -1, -1, 1, 1,
        -1, -1, -1, 1,
        1, -1, 1 ,1,
        1, -1, 1, 1,
        -1, -1, -1, 1,
        1, -1, -1, 1,

        //Back
        -1, -1, -1 ,1,
        -1, 1, -1 ,1,
        1, -1, -1, 1,
        1, -1, -1, 1,
        -1, 1, -1, 1,
        1, 1, -1, 1
    ];
}

function GetCubeUV(faceCount : number) : number[] {
    let uv : number[]= [];

    for (let i = 0; i < faceCount; i++) {
        uv = uv.concat([
            0, 0,
            0, 1,
            1, 0,
            1, 0,
            0, 1,
            1, 1
        ]);
    }

    return uv;
}

function GetCubeNormal(...defineNormal :  number[][]) : number[] {
    let normals : number[]= [];
    
    for (let i = 0; i < defineNormal.length; i++) {
        let face : number[] = [];
        for (let k = 0; k < 6; k++) {
            face = face.concat(defineNormal[i]);
        }
        normals = normals.concat(face);
    }

    return normals;
}