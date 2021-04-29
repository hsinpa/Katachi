import {ShaderRawSourceType} from './WebglType';
import {Dictionary} from 'typescript-collections';
import {GetImagePromise} from '../Utility/UtilityMethod';

export enum SourceType {Texture, Shader, GlMaterial};

class WebglResource {
    textureCache : Dictionary<string, HTMLImageElement>;
    glResourceCache : Dictionary<string, any>; // Should only inpuce WebGLShader, WebGlProgram

    constructor() {
        this.textureCache = new Dictionary();
        this.glResourceCache = new Dictionary();
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
}

export default WebglResource;