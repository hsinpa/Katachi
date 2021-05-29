import Katachi from '../Katachi/Katachi';
import Mesh from '../Katachi/Component/Mesh/Mesh';
import ShapeObject from '../Katachi/Component/Shape/ShapeObject';
import {ReadonlyVec3, vec2, vec3} from 'gl-matrix';
import Camera from '../Katachi/Component/Camera/Camera';
import  { ProjectionType } from '../Katachi/Component/Projection';

import InputHandler, { InputMovementType } from './Input/InputHandler';
import {DeltaTime, SceneLayoutType} from './StaticValues'
import GLTFSceneLoader from '../Katachi/Utility/GLTFSceneLoader'
import DemoSceneAnimation from './DemoSceneAnimation';

class KatachiBasicDemo {
    private katachi : Katachi;
    private sceneLoader : GLTFSceneLoader;

    private inputHandler : InputHandler
    private sceneIsReady: boolean = false;
    private sceneAnimator : DemoSceneAnimation;

    constructor() {
        this.inputHandler = new InputHandler();
        this.inputHandler.RegisterMovementEvent(this.OnMovementEvent.bind(this));
        this.inputHandler.RegisterButtonEvent(this.OnMouseClickEvent.bind(this));
        this.sceneLoader = new GLTFSceneLoader();
    }

    async SetUp(katachi : Katachi, sceneLayoutType : SceneLayoutType) {
        this.katachi = katachi;
        let katachiReady = await katachi.SetUp(this.UpdateLoop.bind(this));

        let canvasDom : HTMLBodyElement = document.querySelector("#webgl_canvas");

        if (katachiReady) {
            this.inputHandler.RegisterMouseMovement(canvasDom, this.OnMouseEvent.bind(this));

            await this.sceneLoader.LoadGLTFContent(katachi, sceneLayoutType);
            this.sceneAnimator = new DemoSceneAnimation(this.katachi.webglContext, this.sceneLoader, this.katachi.scene.camera.transform);

            //this.katachi.materialManager.LoadTextureToObject(this.mainCube, "u_mainTex", "./texture/Personal_01.png");
            //this.mainCube.SetCustomUniformAttr("u_mainColor", {value : [1, 1, 1, 1], isMatrix : false, function : this.katachi.webglContext.uniform4fv})

            this.sceneIsReady = true;
        }
    }

    OnMovementEvent(direction : vec2) {
        if (!this.sceneIsReady) return; 
        let deltaTime = 0.02 ;
        let speed = deltaTime;
        this.katachi.scene.camera.transform.Translate(-direction[0] * speed, 0, direction[1] * speed);
    }

    OnMouseEvent(moveDelta : number[]) {
        const mouseSpeed = 0.3;
        let cameraRot = this.katachi.scene.camera.transform.rotation;

        this.katachi.scene.camera.transform.SetEuler(cameraRot[0] + moveDelta[0] * DeltaTime * mouseSpeed, 
                                                    cameraRot[1] -moveDelta[1] * DeltaTime * mouseSpeed, 
                                                    cameraRot[2]);

        let rightAngleRadian = 0.5 * Math.PI;

        if(cameraRot[1] > rightAngleRadian)
            this.katachi.scene.camera.transform.SetEuler(cameraRot[0], rightAngleRadian, cameraRot[2]);
        if(this.katachi.scene.camera.transform.rotation[1] < -rightAngleRadian)
            this.katachi.scene.camera.transform.SetEuler(cameraRot[0], -rightAngleRadian, cameraRot[2]);
              //console.log(this.katachi.scene.camera.transform.rotation[0]);

        //this.mainQuad.transform.rotation[1] += -moveDelta[1] * 0.02;
    }

    OnMouseClickEvent() {
        // let parent = (this.mainCubeTwo.transform.parent == null) ? this.mainCube.transform : null;
        // console.log(parent);

        // this.mainCubeTwo.transform.SetParent(parent);

        this.sceneAnimator.forceAnimation = !this.sceneAnimator.forceAnimation;
    }

    UpdateLoop(timeSecond : number) {

        this.inputHandler.OnUpdate();

        if (!this.sceneIsReady || this.sceneAnimator == null) return;

        this.sceneAnimator.OnUpdate(timeSecond);
    }
}

export default KatachiBasicDemo;