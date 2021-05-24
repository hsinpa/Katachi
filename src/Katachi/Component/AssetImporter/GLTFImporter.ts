import * as GLTFPlugin from 'webgl-gltf'

export default class GLTFImporter {

    private gl : WebGLRenderingContext;

    constructor(gl : WebGLRenderingContext) {
        this.gl = gl;
    }

    async LoadAsset(filePath :string) {

        return await GLTFPlugin.loadModel(this.gl, filePath);
        // const mesh = gltfModel.meshes[gltfModel.nodes[0].mesh];
    }

}