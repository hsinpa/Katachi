import {MeshType} from '../MeshTypes';

export default function CreateQuadMesh() : MeshType{
    let vertex = GetCubeVertex();
    let color = GetColor([1,1,1,1], 36);
    let uv = GetCubeUV(6);

    //Front, Right, Left, Top, Bottom, Back
    let normal = GetCubeNormal([0, 0, 1], [1, 0, 0],  [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0,0,-1]);

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

function GetColor(color : number[], vertexCount : number) {
    let normals : number[]= [];

    for (let i = 0; i < vertexCount; i++) {
        normals = normals.concat(color);
    }

    return normals;
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