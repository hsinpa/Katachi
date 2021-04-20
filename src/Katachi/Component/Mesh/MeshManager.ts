import Mesh from './Mesh';
import Quad from './Primitive/Quad'
import {MeshIDs} from '../../Utility/KatachiStringSet'

interface MeshCacheType {
    [id: string] : Mesh
} 

class MeshManager {
    
    meshCache : MeshCacheType;

    constructor() {
        this.meshCache = {};
    }

    CreateQuad() {
        let meshID = MeshIDs.Quad;
        
        if (meshID in this.meshCache) {
            return this.meshCache[meshID];
        }

        let meshDataset = Quad();
        let mesh = new Mesh(meshDataset);

        this.meshCache[meshID] = mesh;

        return mesh;
    }

}

export default MeshManager;