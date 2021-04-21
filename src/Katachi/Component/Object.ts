import Transform, {CreateEmptyTransform} from './Transform';

export default class ObjectBase {
    id : string = "";
    name : string = "NoName";
    transform : Transform;

    constructor() {
        this.transform = CreateEmptyTransform();
    }

    SetPosition() {
        
    }

    Translate(x : number, y : number, z : number) {
        
    }
}