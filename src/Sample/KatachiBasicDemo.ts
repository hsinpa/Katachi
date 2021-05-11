import Katachi from '../Katachi/Katachi';
import Mesh from '../Katachi/Component/Mesh/Mesh';
import ShapeObject from '../Katachi/Component/Shape/ShapeObject';
import {vec2, vec3} from 'gl-matrix';
import Camera from '../Katachi/Component/Camera/Camera';
import  { ProjectionType } from '../Katachi/Component/Projection';

import InputHandler, { InputMovementType } from './Input/InputHandler';
import {DeltaTime} from './StaticValues'

class KatachiBasicDemo {
    private katachi : Katachi;
    private mainQuad : ShapeObject;
    private mainCube : ShapeObject;
    private mainCubeTwo : ShapeObject;
    private mainFloor : ShapeObject;

    private inputHandler : InputHandler
    private katachiIsReady: boolean;

    constructor() {
        this.inputHandler = new InputHandler();
        this.inputHandler.RegisterMovementEvent(this.OnMovementEvent.bind(this));
    }

    async SetUp(katachi : Katachi) {
        this.katachi = katachi;
        this.katachiIsReady = await katachi.SetUp(this.UpdateLoop.bind(this));

        let canvasDom : HTMLBodyElement = document.querySelector("#webgl_canvas");

        if (this.katachiIsReady) {
            this.inputHandler.RegisterMouseMovement(canvasDom, this.OnMouseEvent.bind(this));

            //this.katachi.scene.camera.projection.projectionType = ProjectionType.Perspective;
            this.mainQuad = katachi.shapeBuilder.BuildQuad();
            this.mainCube = katachi.shapeBuilder.BuildCube();
            this.mainCubeTwo = katachi.shapeBuilder.BuildCube();
            this.mainFloor = katachi.shapeBuilder.BuildQuad();

            this.mainQuad.transform.Scale(0.2);
            this.mainQuad.transform.position[2] = -1;
            this.mainQuad.transform.position[0] = -1.2;

            this.mainCube.transform.Scale(0.5);
            this.mainCube.transform.position[2] = -2;

            this.mainCubeTwo.transform.Scale(0.2);
            // this.mainCubeTwo.transform.position[2] = -2;
            // this.mainCubeTwo.transform.position[1] = 1;
            this.mainCubeTwo.transform.SetParent(this.mainCube.transform);

            this.mainFloor.transform.rotation[0] = Math.PI*1.5;
            this.mainFloor.transform.position[1] = -0.5;
            this.mainFloor.transform.Scale(5);

            katachi.scene.InsertShapeObj(this.mainCube);
            katachi.scene.InsertShapeObj(this.mainQuad);
            katachi.scene.InsertShapeObj(this.mainFloor);
            katachi.scene.InsertShapeObj(this.mainCubeTwo);


            this.katachi.materialManager.LoadTextureToObject(this.mainQuad, "u_mainTex", "./texture/BrickTex_256.jpg");
            this.katachi.materialManager.LoadTextureToObject(this.mainCube, "u_mainTex", "./texture/Personal_01.png");
            
            this.mainCube.SetCustomUniformAttr("u_mainColor", {value : [1, 1, 1, 1], isMatrix : false, function : this.katachi.webglContext.uniform4fv})
            this.mainQuad.SetCustomUniformAttr("u_mainColor", {value : [0, 0, 1, 1], isMatrix : false, function : this.katachi.webglContext.uniform4fv})
            this.mainFloor.SetCustomUniformAttr("u_mainColor", {value : [1,1,1, 1], isMatrix : false, function : this.katachi.webglContext.uniform4fv})
        }
    }

    OnMovementEvent(direction : vec2) {
        if (!this.katachiIsReady) return; 
        let deltaTime = 0.02 ;
        let speed = deltaTime;
        this.katachi.scene.camera.transform.Translate(-direction[0] * speed, 0, direction[1] * speed);
    }

    OnMouseEvent(moveDelta : number[]) {
        const mouseSpeed = 0.3;
        this.katachi.scene.camera.transform.rotation[0] += moveDelta[0] * DeltaTime * mouseSpeed;
        this.katachi.scene.camera.transform.rotation[1] += -moveDelta[1] * DeltaTime * mouseSpeed;

        let rightAngleRadian = 0.5 * Math.PI;

        if(this.katachi.scene.camera.transform.rotation[1] > rightAngleRadian)
            this.katachi.scene.camera.transform.rotation[1] =  rightAngleRadian;
        if(this.katachi.scene.camera.transform.rotation[1] < -rightAngleRadian)
            this.katachi.scene.camera.transform.rotation[1] = -rightAngleRadian;
              //console.log(this.katachi.scene.camera.transform.rotation[0]);

        //this.mainQuad.transform.rotation[1] += -moveDelta[1] * 0.02;
    }

    UpdateLoop(timeSecond : number) {

        this.inputHandler.OnUpdate();

        if (this.katachi == null|| this.mainQuad == null) return;

        // console.log(this.katachi.scene.lights.directionLigth.transform.rotation[0]);
        //this.mainCube.transform.Translate(Math.sin(timeSecond)*0.02, 0, 0);
        //this.mainCube.transform.Rotate(0.01, 0, 0);
        //this.mainCube.transform.rotation[1] += 0.01;

        let rotate = this.mainCube.transform.Rotation;

        // let camX = Math.sin(timeSecond) * 2;
        // let camZ = Math.cos(timeSecond) * 2;

        // this.katachi.scene.camera.transform.position[0] =camX;
        // this.katachi.scene.camera.transform.position[2] =camZ;
    }

}

export default KatachiBasicDemo;