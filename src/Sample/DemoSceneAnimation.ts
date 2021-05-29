import { ReadonlyVec3, vec3 } from "gl-matrix";
import ShapeObject from "../Katachi/Component/Shape/ShapeObject";
import Transform from "../Katachi/Component/Transform/Transform";
import { Lerp } from "../Katachi/Utility/UtilityMethod";
import GLTFSceneLoader from "../Katachi/Utility/GLTFSceneLoader";
import {DefaultVertexShaderParameter} from '../Katachi/Component/Material/MaterialTypes';

let animObjID = Object.freeze({
    poly_pillar : "gltf@low_poly_pillar_1",
    temple_stick : "gltf@low_holy_stick_1",
    child_sphere : "gltf@low_sphere_1"
});

export default class DemoSceneAnimation {
    
    private sceneLoader : GLTFSceneLoader;
    private cameraTransform : Transform;
    private sphereOriginPosition : vec3 = vec3.create();
    private sphereTargetPosition : vec3 = vec3.create();
    private sphereOriginColor : readonly number[] = Object.freeze([1,1,1,1]);

    private objChildSphere : ShapeObject;
    private objTempleStick : ShapeObject;
    private gl : WebGLRenderingContext;

    forceAnimation : boolean = false;

    constructor(gl : WebGLRenderingContext, sceneLoader : GLTFSceneLoader, cameraTransform : Transform) {
        this.gl = gl;
        this.sceneLoader = sceneLoader
        this.cameraTransform = cameraTransform;

        this.objChildSphere = this.sceneLoader.GetGLTFShapeObject(animObjID.child_sphere);
        this.objTempleStick = this.sceneLoader.GetGLTFShapeObject(animObjID.temple_stick);
        vec3.copy(this.sphereOriginPosition, this.objChildSphere.transform.relativePosition);
    }

    OnUpdate(time : number) {
        if (this.cameraTransform == null) return;

        let isInRange = this.IsWithinTriggerRange(1.5, this.cameraTransform.position);

        if (!isInRange && !this.forceAnimation) {
            this.sphereTargetPosition[1] = Lerp(this.objChildSphere.transform.relativePosition[1], this.sphereOriginPosition[1], 0.1);
            this.objChildSphere.SetCustomUniformAttr(DefaultVertexShaderParameter.mainColor, {value : this.sphereOriginColor, isMatrix : false, function : this.gl.uniform4fv})
        } else {
            this.ExecuteAnimationSet(time);
        }

        let sphereRelatviePos = this.objChildSphere.transform.relativePosition;

        this.objChildSphere.transform.SetPosition(sphereRelatviePos[0], this.sphereTargetPosition[1], sphereRelatviePos[2]);
    }

    private ExecuteAnimationSet(time : number) {
        let t = Math.sin(time);

        this.objTempleStick.transform.Rotate(0, 0.02, 0);

        let offsetHeight = 3;

        this.sphereTargetPosition[1] = Lerp(this.objChildSphere.transform.relativePosition[1], (t*2) + this.sphereOriginPosition[1] + offsetHeight, 0.1);
        this.objChildSphere.SetCustomUniformAttr(DefaultVertexShaderParameter.mainColor, {value : [1-t, t, Math.cos(time), 1], isMatrix : false, function : this.gl.uniform4fv})
    }

    private IsWithinTriggerRange(range : number, cameraPos : ReadonlyVec3) {
        let pillarObj = this.sceneLoader.GetGLTFShapeObject(animObjID.poly_pillar);
        let dist = vec3.dist(pillarObj.transform.position, cameraPos);

        return dist < range;
    }



}