import Mesh from './Mesh';
import Quad from './Primitive/Quad';
import Cube from './Primitive/Cube';
import Null from './Primitive/Null';

import {MeshIDs} from '../../Utility/KatachiStringSet'
import { MeshType } from './MeshTypes';

interface MeshCacheType {
    [id: string] : Mesh
} 

interface GetMeshFunc {
    () : MeshType
};

class MeshManager {
    
    meshCache : MeshCacheType;

    constructor() {
        this.meshCache = {};
    }

    CreateQuad() {
        return this.CreateAndCacehMeshType(MeshIDs.Quad, Quad);
    }

    CreateCube() {
        return this.CreateAndCacehMeshType(MeshIDs.Cube, Cube);
    }

    CreateNull(id : string) {
        return this.CreateAndCacehMeshType(id, Null);
    }

    private CreateAndCacehMeshType(id : string, meshFunc : GetMeshFunc) {
        if (id in this.meshCache) {
            return this.meshCache[id];
        }

        let meshDataset = meshFunc();
        let mesh = new Mesh(meshDataset);

        this.meshCache[id] = mesh;

        return mesh;
    }

}

export default MeshManager;