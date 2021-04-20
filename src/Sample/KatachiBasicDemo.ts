import Katachi from '../Katachi/Katachi';
import Mesh from '../Katachi/Component/Mesh/Mesh';

class KatachiBasicDemo {
    async SetUp(katachi : Katachi) {
        let isKatachiAvailble = await katachi.SetUp();

        if (isKatachiAvailble) {
            let quadObj = katachi.shapeBuilder.BuildQuad();

            katachi.scene.InsertShapeObj(quadObj);

            katachi.DrawCanvas();
        }
    }
}

export default KatachiBasicDemo;