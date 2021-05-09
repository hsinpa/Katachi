import WebglCanvas from './WebGL/WebglCanvas';
import {KatachiConfigJson} from './WebGL/WebglType';
import WebglResource from './WebGL/WebglResource';

import MaterialManager from './Component/Material/MaterialManager';
import MeshManager from './Component/Mesh/MeshManager';
import Mesh from './Component/Mesh/Mesh';
import ShapeBuilder from './Component/Shape/ShapeBuilder';
import Scene from './Component/Scene';
import { mat4, vec2 } from 'gl-matrix';
import ShapeObject from './Component/Shape/ShapeObject';
import WebGLDepthBuffer from './WebGL/WebGLDepthBuffer';
import { Projection } from './Component/Projection';
import Material from './Component/Material/Material';

export type UpdateLoopCallbackType = (timeinSecond : number) => void;

class Katachi extends WebglCanvas {
    configJson : KatachiConfigJson;
    webglResouceAlloc : WebglResource;

    materialManager : MaterialManager;
    meshManager : MeshManager;
    shapeBuilder : ShapeBuilder;
    webglDepthBuffer : WebGLDepthBuffer;
    
    scene : Scene;

    private previousTimeStamp : number = 0;
    
    private readonly targetTextureWidth = 512;
    private readonly targetTextureHeight = 512;
    private readonly targetTextureTexel = vec2.fromValues(1 / this.targetTextureWidth, 1 / this.targetTextureHeight);
    private currentFrameBuffer : WebGLFramebuffer;

    public time : number;

    private UpdateLoopCallback? : UpdateLoopCallbackType;

    public get isKatachiValid() {
        return this._gl != null;
    }

    constructor(configJson : KatachiConfigJson) {
        super(configJson);
        this.configJson = configJson;
        this.webglResouceAlloc = new WebglResource();

        this.materialManager = new MaterialManager(this._gl, this.webglResouceAlloc);
        this.meshManager = new MeshManager();
        this.shapeBuilder = new ShapeBuilder(this._gl, this.materialManager, this.meshManager);

        this.webglDepthBuffer = new WebGLDepthBuffer(this._gl, this.webglResouceAlloc, this.materialManager);

        this.scene = new Scene();
    }

    public async SetUp(UpdateLoopCallback? : UpdateLoopCallbackType) {
        if (!this.isKatachiValid) return false;
        
        this.UpdateLoopCallback = UpdateLoopCallback;

        await this.materialManager.LoadAndPrepareShaders(this.configJson.shaders);

        this.webglDepthBuffer.PrepareDepthFrameBuffer(this.targetTextureWidth, this.targetTextureHeight);
        this.webglDepthBuffer.CacheDepthMaterial();

        window.requestAnimationFrame(this.PerformGameLoop.bind(this));

        return true;
    }
    
    private PerformGameLoop(timeStamp : number) {
        let ms =  (timeStamp - this.previousTimeStamp) / 1000;
        this.time = (timeStamp) / 1000;
        this.previousTimeStamp = timeStamp;

        if (this.UpdateLoopCallback != null)
            this.UpdateLoopCallback(this.time);

        //Update Light map, per half second, to avoid glitching
        if (this.scene.lights != null && this.time % 0.5 > 0.45)
            this.scene.lights.SyncLightRelativePosToCamera(this.scene.camera.transform);

        //Depth Map Rendering
        this.DrawCanvas(this.webglDepthBuffer.depthFrameBuffer, this.webglDepthBuffer.depthMaterial,this.scene.lights.directionLigth.projection, this.targetTextureWidth, this.targetTextureHeight);

        //Actual rendering
        this.DrawCanvas(null, null, this.scene.camera.projection, this._gl.canvas.width, this._gl.canvas.height);

        window.requestAnimationFrame(this.PerformGameLoop.bind(this));
    }

    public DrawCanvas(frameBuffer : WebGLFramebuffer, defaultMaterial : Material, projection : Projection, canvasWidth : number, canvasHeight : number) {
        let gl = this._gl;
        this.currentFrameBuffer = frameBuffer;
        gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
        gl.viewport(0, 0, canvasWidth, canvasHeight);        
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);     

        projection.aspectRatio = canvasWidth / canvasHeight;
        let cameraViewMatrix = projection.viewMatrix;
        let cameraProjectionMatrix = projection.projectionMatrix;

        for (var shapeID in this.scene.shapeArray) {
            let shapeObject = this.scene.shapeArray[shapeID];
            this.ProcessShapeObject(shapeObject, cameraViewMatrix, cameraProjectionMatrix, defaultMaterial);
        }
    }

    private ProcessShapeObject( shapeObject : ShapeObject, viewMatrix : mat4, projectionMatrix : mat4, defaultMaterial : Material) {
        let material = (defaultMaterial == null) ? shapeObject.material : defaultMaterial
        this._gl.useProgram(material.glProgram);

        const mvpMatrix = shapeObject.GetMVPMatrix(viewMatrix, projectionMatrix);

        shapeObject.ProcessMaterialAttr(this._gl, material);

        shapeObject.ProcessMaterialUniform(this._gl, material, this.time, shapeObject.transform.modelMatrix, shapeObject.transform.InverseTransposeMatrix,
             mvpMatrix, this.scene.lights, (this.currentFrameBuffer == null) ? this.webglDepthBuffer.depthMapTex : null, this.targetTextureTexel);

        var primitiveType = this._gl.TRIANGLES;
        var offset = 0;
        var count = shapeObject.mesh.vertCount;

        this._gl.drawArrays(primitiveType, offset, count);
    }
}

export default Katachi;