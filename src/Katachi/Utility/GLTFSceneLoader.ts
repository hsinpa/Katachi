import GLTFShapeObject from '..//Component/Shape/GLTFShapeObject';
import ShapeObject from '../Component/Shape/ShapeObject';
import Katachi from '../Katachi';
import {DefaultVertexShaderParameter} from '../Component/Material/MaterialTypes';
import {SceneLayoutType, GLTFMarkoutType} from './UniversalType';

export default class GLTFSceneLoader {
    private gltfCache : any = {};

    async LoadGLTFContent(katachi : Katachi, sceneJsonConfig: SceneLayoutType) {
        let gltfPromiseArray = sceneJsonConfig.gltf.map(x=> katachi.shapeBuilder.BuildGLTFShape(x.id, x.path));
        let self = this;

        let gltfCount = sceneJsonConfig.gltf.length;
        for (let i = 0; i < gltfCount; i++) {
            let gltfModel = await gltfPromiseArray[i];

            self.SetGLTFToConfigLayout(katachi, sceneJsonConfig.gltf[i], (gltfModel));
        }

        // await Promise.all(gltfPromiseArray).then(function(values) {
        //     let gltfCount = sceneJsonConfig.gltf.length;

        //     for (let i = 0; i < gltfCount; i++) {
        //         self.SetGLTFToConfigLayout(katachi, sceneJsonConfig.gltf[i], (values[i]));
        //     }
        // });
    }

    GetGLTFShapeObject(id : string) : ShapeObject {
        if (this.gltfCache.hasOwnProperty(id)) {
            return this.gltfCache[id];
        }

        return null;
    }

    ClearUp() {
        this.gltfCache = {};
    }

    private SetGLTFToConfigLayout(katachi : Katachi, gltfMarkup : GLTFMarkoutType, shapeObject : GLTFShapeObject) {
        this.gltfCache[gltfMarkup.id] = shapeObject;

        let parentObject = this.GetGLTFShapeObject(gltfMarkup.parent_id);

        shapeObject.transform.Scale(gltfMarkup.scale);
        shapeObject.transform.SetPosition(gltfMarkup.position[0], gltfMarkup.position[1], gltfMarkup.position[2]);
        shapeObject.transform.SetEuler(gltfMarkup.orientation[0], gltfMarkup.orientation[1], gltfMarkup.orientation[2]);

        shapeObject.SetCustomUniformAttr(DefaultVertexShaderParameter.specularLightStrength, {value : gltfMarkup.specular, isMatrix : false, function : katachi.webglContext.uniform1f});

        katachi.scene.AddShapeObj(shapeObject);
        if (parentObject != null)
            katachi.scene.SetParent(parentObject, shapeObject);
    }

}