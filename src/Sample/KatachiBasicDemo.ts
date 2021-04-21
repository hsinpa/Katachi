import Katachi from '../Katachi/Katachi';
import Mesh from '../Katachi/Component/Mesh/Mesh';
import ShapeObject from '../Katachi/Component/Shape/ShapeObject';
import {vec3} from 'gl-matrix';
import Camera from '../Katachi/Component/Camera/Camera';

class KatachiBasicDemo {
    private katachi : Katachi;
    private mainQuad : ShapeObject;

    async SetUp(katachi : Katachi) {
        this.katachi = katachi;
        let isKatachiAvailble = await katachi.SetUp(this.UpdateLoop.bind(this));

        if (isKatachiAvailble) {
            this.mainQuad = katachi.shapeBuilder.BuildQuad();

            katachi.scene.InsertShapeObj(this.mainQuad);

            katachi.DrawCanvas();
        }
    }

    UpdateLoop(timeSecond : number) {
        if (this.katachi == null|| this.mainQuad == null) return;
        
        this.katachi.scene.camera.transform.position[0] = timeSecond * 0.01;
    }
}

export default KatachiBasicDemo;