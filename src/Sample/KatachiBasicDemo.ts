import Katachi from '../Katachi/Katachi';
import Mesh from '../Katachi/Component/Mesh/Mesh';
import ShapeObject from '../Katachi/Component/Shape/ShapeObject';
import {vec2, vec3} from 'gl-matrix';
import Camera, { ProjectionType } from '../Katachi/Component/Camera/Camera';
import InputHandler, { InputMovementType } from './Input/InputHandler';

class KatachiBasicDemo {
    private katachi : Katachi;
    private mainQuad : ShapeObject;
    private mainCube : ShapeObject;

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

            this.katachi.scene.camera.projectionType = ProjectionType.Perspective;
            this.mainQuad = katachi.shapeBuilder.BuildQuad();
            this.mainCube = katachi.shapeBuilder.BuildCube();

            this.mainQuad.Scale(0.2);
            this.mainQuad.transform.position[2] = -1;
            this.mainQuad.transform.position[0] = -1.2;

            this.mainCube.Scale(0.5);
            this.mainCube.transform.position[2] = -2;

            katachi.scene.InsertShapeObj(this.mainQuad);
            katachi.scene.InsertShapeObj(this.mainCube);

            katachi.DrawCanvas();
        }
    }

    OnMovementEvent(direction : vec2) {
        if (!this.katachiIsReady) return; 
        let deltaTime = 0.02 ;

        this.katachi.scene.camera.Translate(direction[0] * deltaTime, 0, direction[1] * deltaTime);
    }

    OnMouseEvent(moveDelta : number[]) {


        this.katachi.scene.camera.transform.rotation[0] += moveDelta[0] * 0.02 * 0.5;
        this.katachi.scene.camera.transform.rotation[1] += -moveDelta[1] * 0.02 * 0.5;

        let rightAngleRadian = 0.5 * Math.PI;

        if(this.katachi.scene.camera.transform.rotation[1] > rightAngleRadian)
            this.katachi.scene.camera.transform.rotation[1] =  rightAngleRadian;
        if(this.katachi.scene.camera.transform.rotation[1] < -rightAngleRadian)
            this.katachi.scene.camera.transform.rotation[1] = -rightAngleRadian;
              //console.log(this.katachi.scene.camera.transform.rotation[0]);

        //this.mainQuad.transform.rotation[1] += -moveDelta[1] * 0.02;
    }

    UpdateLoop(timeSecond : number) {
        if (this.katachi == null|| this.mainQuad == null) return;
        //this.mainQuad.transform.rotation[0] += timeSecond * 0.02;

        // let camX = Math.sin(timeSecond) * 2;
        // let camZ = Math.cos(timeSecond) * 2;

        // this.katachi.scene.camera.transform.position[0] =camX;
        // this.katachi.scene.camera.transform.position[2] =camZ;

    }
}

export default KatachiBasicDemo;