import WebglCanvas from './WebGL/WebglCanvas';
import {KatachiConfigJson} from './WebGL/WebglType';
import WebglSetupHelper from './WebGL/WebglSetupHelper';
import WebglResource from './WebGL/WebglResource';

import MaterialManager from './Component/Material/MaterialManager';
import MeshManager from './Component/Mesh/MeshManager';
import Mesh from './Component/Mesh/Mesh';
import ShapeBuilder from './Component/ShapeBuilder';
import Scene from './Component/Scene';

export type UpdateLoopCallbackType = (timeinSecond : number) => void;

class Katachi extends WebglCanvas {
    webglSetupHelper : WebglSetupHelper;
    webglResouceAlloc : WebglResource;

    materialManager : MaterialManager;
    meshManager : MeshManager;
    shapeBuilder : ShapeBuilder;
    scene : Scene;

    private previousTimeStamp : number;
    public time : number;

    private UpdateLoopCallback? : UpdateLoopCallbackType;

    public get isKatachiValid() {
        return this._gl != null;
    }

    constructor(configJson : KatachiConfigJson, UpdateLoopCallback? : UpdateLoopCallbackType) {
        super(configJson);

        this.UpdateLoopCallback = UpdateLoopCallback;
        this.webglResouceAlloc = new WebglResource();
        this.webglSetupHelper = new WebglSetupHelper(this.webglResouceAlloc);

        this.materialManager = new MaterialManager(configJson, this._gl, this.webglSetupHelper, this.webglResouceAlloc);
        this.meshManager = new MeshManager();
        this.shapeBuilder = new ShapeBuilder(this._gl, this.materialManager, this.meshManager);
        this.scene = new Scene();
    }

    public async SetUp() {
        if (!this.isKatachiValid) return false;
        
        await this.materialManager.SetDefaultMaterial();

        window.requestAnimationFrame(this.PerformGameLoop);

        return true;
    }

    private PerformGameLoop(timeStamp : number) {
        this.time = (timeStamp - this.previousTimeStamp) / 1000;
        this.previousTimeStamp = timeStamp;

        console.log(this.time);

        if (this.UpdateLoopCallback != null)
            this.UpdateLoopCallback(this.time);

        window.requestAnimationFrame(this.PerformGameLoop);
    }

    public DrawCanvas() {
        let gl = this._gl;
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        let keys = Object.keys(this.scene.shapeArray);
        let keyLength = keys.length;

        for (let i = 0; i < keyLength; i++) {
            let shapeObject = this.scene.shapeArray[keys[i]];

            this._gl.useProgram(shapeObject.material.glProgram);

            shapeObject.ProcessMaterialAttr(this._gl);
            shapeObject.ProcessMaterialUnifrom(this._gl, 0);


            var primitiveType = gl.TRIANGLES;
            var offset = 0;
            var count = shapeObject.mesh.vertCount;

            gl.drawArrays(primitiveType, offset, count);
        }        
    }
}

export default Katachi;