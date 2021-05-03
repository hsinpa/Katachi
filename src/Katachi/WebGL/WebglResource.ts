import {ShaderRawSourceType} from './WebglType';
import {Dictionary} from 'typescript-collections';
import {GetImagePromise} from '../Utility/UtilityMethod';

export enum SourceType {Texture, Shader, GlMaterial};

export interface GLTextureType {
    uniformLocation : WebGLUniformLocation,
    texture : WebGLTexture,
    localIndex : number,
    globalIndex : number
}

class WebglResource {
    textureCache : Dictionary<string, HTMLImageElement>;
    glResourceCache : Dictionary<string, any>; // Should only inpuce WebGLShader, WebGlProgram
    glTextureCache : Dictionary<string, GLTextureType>;

    constructor() {
        this.textureCache = new Dictionary();
        this.glResourceCache = new Dictionary();
        this.glTextureCache = new Dictionary();
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

    CreateGLTexture(gl : WebGLRenderingContext, width : number, height : number, data : ArrayBufferView) {
        const targetTexture = gl.createTexture();

        gl.bindTexture(gl.TEXTURE_2D, targetTexture);
        
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA,
            width, height, 0,gl.RGBA, gl.UNSIGNED_BYTE, data);
        
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        
        return targetTexture;
    }

    GetGLTextureSource(key : string) {
        if (this.glTextureCache.containsKey(key)) {
            return this.glTextureCache.getValue(key);
        }
        return null;
    }

    SaveGLTextureSource(key : string, webglTexture : WebGLTexture,  uniformLocation : WebGLUniformLocation, texBaseIndex : number ){
        let currentIndex = this.glTextureCache.size();
        let globalIndex = texBaseIndex + currentIndex;

        return this.glTextureCache.setValue(key, {uniformLocation : uniformLocation, localIndex : currentIndex, globalIndex : globalIndex, texture : webglTexture});
    }
}

export default WebglResource;