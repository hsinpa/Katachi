import {MeshType} from '../MeshTypes';

export default function CreateNullMesh() : MeshType{
    return {
        vertex : null,
        uv : null,
        normal : null,
        tangent : null,
        glUsageType : WebGLRenderingContext.STATIC_DRAW,

        nativeVertex : null,
        nativeNormal : null,
        nativeUV : null,
        nativeTangent : null,

        vertexCount : 0,
        
        glBufferIndices : null,
        glBufferVertex:null,
        glBufferNormal:null,
        glBufferUV:null,
        glBufferTangent : null
    }
}