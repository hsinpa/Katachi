import { vec3 } from 'gl-matrix';
import Transform, {CreateEmptyTransform} from './Transform/Transform';

export default class ObjectBase {
    id : string = "";
    name : string = "NoName";
    transform : Transform;

    constructor() {
        this.transform = CreateEmptyTransform();
    }

    SetPosition() {
        
    }
}