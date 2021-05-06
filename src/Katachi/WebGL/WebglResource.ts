import {ShaderRawSourceType} from './WebglType';
import {Dictionary} from 'typescript-collections';
import {GetImagePromise} from '../Utility/UtilityMethod';
import {DefaultVertexShaderParameter} from '../Component/Material/MaterialTypes';

export enum SourceType {Texture, Shader, GlMaterial};

export interface GLTextureType {
    globalType : GLTextureGlobalType,
    localType : GLTextureLocalType
}

export interface GLTextureGlobalType {
    texture : WebGLTexture,
    globalIndex : number
}

export interface GLTextureLocalType {
    uniformLocation : WebGLUniformLocation,
    localIndex : number,
    texture_key : string
}

class WebglResource {
    textureCache : Dictionary<string, HTMLImageElement>;
    glResourceCache : Dictionary<string, any>; // Should only inpuce WebGLShader, WebGlProgram
    glLocalTextureCache : Dictionary<string, GLTextureLocalType>;
    glGlobalTextureCache : Dictionary<string, GLTextureGlobalType>;

    constructor() {
        this.textureCache = new Dictionary();
        this.glResourceCache = new Dictionary();
        this.glLocalTextureCache = new Dictionary();
        this.glGlobalTextureCache = new Dictionary();
    }

    async PrepareVFShaders(vertFilePath: string, fragFilePath: string) {
        let VertPros = fetch(vertFilePath, {method: 'GET', credentials: 'include'});
        let FragPros = fetch(fragFilePath, {method: 'GET', credentials: 'include'});
    
        return Promise.all([VertPros, FragPros ])
        .then( responses =>
            Promise.all(
                [responses[0].text(), responses[1].text()]
            )
        ).then((values) => {
            let gLSLDataSet : ShaderRawSourceType = {
                vertex_shader : values[0],
                fragment_shader : values[1],
            };

            return gLSLDataSet; 
        });
    }

    async GetImage(path : string) : Promise<HTMLImageElement> {

        if (this.textureCache.containsKey(path)) {
            return this.textureCache.getValue(path);
        }

        let texture = await GetImagePromise(path);
        this.textureCache.setValue(path, texture);

        return texture;         
    }

    GetCacheSource(key : string) {
        if (this.glResourceCache.containsKey(key)) {
            return this.glResourceCache.getValue(key);
        }
        return null;
    }

    SaveCacheSource(key : string, glSource : any){
        if (this.glResourceCache.containsKey(key)) {
            return this.glResourceCache.setValue(key, glSource);
        }
    }

    CreateGLTexture(gl : WebGLRenderingContext, width : number, height : number, format : number, type : number, data : ArrayBufferView) {
        const targetTexture = gl.createTexture();

        gl.bindTexture(gl.TEXTURE_2D, targetTexture);
        
        gl.texImage2D(gl.TEXTURE_2D, 0, format, width, height, 0, format, type, data);
        
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        
        return targetTexture;
    }

    GetGLTextureSource(key : string, localTextureOffset : number) {
        if (!this.glLocalTextureCache.containsKey(key)) return null;

        let localTexCache = this.glLocalTextureCache.getValue(key);

        if (!this.glGlobalTextureCache.containsKey(localTexCache.texture_key)) return null;

        let globalTexCache = this.glGlobalTextureCache.getValue(localTexCache.texture_key);
        localTexCache.localIndex = globalTexCache.globalIndex - localTextureOffset;

        return {globalType : globalTexCache, localType : localTexCache} as GLTextureType;
    }

    SaveGlobalTextureSource(key : string, webglTexture : WebGLTexture, texBaseIndex : number) {
        let currentIndex = texBaseIndex + this.glGlobalTextureCache.size();
        let globalTextureType : GLTextureGlobalType = {texture : webglTexture, globalIndex : currentIndex}; 

        this.glGlobalTextureCache.setValue(key, globalTextureType);
        return globalTextureType;
    }

    SaveGLTextureSource(key : string, globalTextureKey : string,  uniformLocation : WebGLUniformLocation ){
        let localTextureType : GLTextureLocalType = {uniformLocation : uniformLocation, localIndex : -1, texture_key : globalTextureKey};
        this.glLocalTextureCache.setValue(key, localTextureType);
        return localTextureType;
    }
}

export default WebglResource;