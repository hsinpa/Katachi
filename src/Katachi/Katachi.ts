import WebglCanvas from './WebGL/WebglCanvas';
import {KatachiConfigJson} from './WebGL/WebglType';
import WebglResource from './WebGL/WebglResource';

import MaterialManager from './Component/Material/MaterialManager';
import MeshManager from './Component/Mesh/MeshManager';
import Mesh from './Component/Mesh/Mesh';
import ShapeBuilder from './Component/Shape/ShapeBuilder';
import Scene from './Component/Scene';
import { mat4 } from 'gl-matrix';
import ShapeObject from './Component/Shape/ShapeObject';

export type UpdateLoopCallbackType = (timeinSecond : number) => void;

class Katachi extends WebglCanvas {
    configJson : KatachiConfigJson;
    webglResouceAlloc : WebglResource;

    materialManager : MaterialManager;
    meshManager : MeshManager;
    shapeBuilder : ShapeBuilder;
    scene : Scene;

    private previousTimeStamp : number = 0;
    
    //Depth Section
    private depthFrameBuffer : WebGLFramebuffer;
    private depthRenderBuffer : WebGLRenderbuffer;
    private depthTexture : WebGLTexture;

    private readonly targetTextureWidth = 256;
    private readonly targetTextureHeight = 256;

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
        this.scene = new Scene();
    }

    public async SetUp(UpdateLoopCallback? : UpdateLoopCallbackType) {
        if (!this.isKatachiValid) return false;
        
        this.UpdateLoopCallback = UpdateLoopCallback;

        await this.materialManager.LoadAndPrepareShaders(this.configJson.shaders);

        this.PrepareDepthFrameBuffer();

        window.requestAnimationFrame(this.PerformGameLoop.bind(this));

        return true;
    }

    private PrepareDepthFrameBuffer() {
        this.depthTexture = this.webglResouceAlloc.CreateGLTexture(this._gl, this.targetTextureWidth, this.targetTextureHeight, null);

        this.depthFrameBuffer = this._gl.createFramebuffer();
        this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, this.depthFrameBuffer);

        const attachmentPoint = this._gl.COLOR_ATTACHMENT0;
        this._gl.framebufferTexture2D(this._gl.FRAMEBUFFER, attachmentPoint, this._gl.TEXTURE_2D, this.depthTexture, 0);

        this.depthRenderBuffer = this._gl.createRenderbuffer();
        this._gl.bindRenderbuffer(this._gl.RENDERBUFFER, this.depthRenderBuffer);
        
        // make a depth buffer and the same size as the targetTexture
        this._gl.renderbufferStorage(this._gl.RENDERBUFFER, this._gl.DEPTH_COMPONENT16, this.targetTextureWidth, this.targetTextureHeight);
        this._gl.framebufferRenderbuffer(this._gl.FRAMEBUFFER, this._gl.DEPTH_ATTACHMENT, this._gl.RENDERBUFFER, this.depthRenderBuffer);
    }
    
    private PerformGameLoop(timeStamp : number) {
        let ms =  (timeStamp - this.previousTimeStamp) / 1000;
        this.time = (timeStamp) / 1000;
        this.previousTimeStamp = timeStamp;

        if (this.UpdateLoopCallback != null)
            this.UpdateLoopCallback(this.time);

        //Depth Map Rendering
        this.DrawCanvas(this.depthFrameBuffer, this.targetTextureWidth, this.targetTextureHeight);

        //Actual rendering
        //this.DrawCanvas(null, this._gl.canvas.width, this._gl.canvas.height);

        window.requestAnimationFrame(this.PerformGameLoop.bind(this));
    }

    public DrawCanvas(frameBuffer : WebGLFramebuffer, canvasWidth : number, canvasHeight : number) {
        let gl = this._gl;

        gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
        
        //this._gl.bindTexture(this._gl.TEXTURE_2D, this.depthTexture);

        gl.viewport(0, 0, canvasWidth, canvasHeight);        
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        this.scene.camera.SetCanvasWidthHeight(canvasWidth, canvasHeight);
        let cameraViewMatrix = this.scene.camera.viewMatrix;
        let cameraProjectionMatrix = this.scene.camera.projectionMatrix;

        for (var shapeID in this.scene.shapeArray) {
            let shapeObject = this.scene.shapeArray[shapeID];
            this.ProcessShapeObject(shapeObject, cameraViewMatrix, cameraProjectionMatrix);
        }
    }

    private ProcessShapeObject( shapeObject : ShapeObject, viewMatrix : mat4, projectionMatrix : mat4) {
        this._gl.useProgram(shapeObject.material.glProgram);

        const mvpMatrix = shapeObject.GetMVPMatrix(viewMatrix, projectionMatrix);

        shapeObject.ProcessMaterialAttr(this._gl);
        shapeObject.ProcessMaterialUniform(this._gl, this.time, shapeObject.transform.modelMatrix, shapeObject.transform.InverseTransposeMatrix,
             mvpMatrix, this.scene.directionLight, this.depthTexture);

        var primitiveType = this._gl.TRIANGLES;
        var offset = 0;
        var count = shapeObject.mesh.vertCount;

        this._gl.drawArrays(primitiveType, offset, count);
    }
}

export default Katachi;