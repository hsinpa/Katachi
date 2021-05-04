import {GLUniformFunction, ShaderAttributConfigType, GLAttrShaderPosition, GLUniformShaderPosition, ShaderConfigType, GLUniformTextures, ShaderUniformConfigType} from './MaterialTypes';
import {GetGLTexture} from './MaterialHelper';
import WebglResource from '../../WebGL/WebglResource';

class Material {
    id : string;
    glProgram : WebGLProgram;

    cacheAttrShaderPosition : GLAttrShaderPosition;
    cacheUniformShaderPosition : GLUniformShaderPosition;

    glResource: WebglResource;

    constructor(id : string, glProgram : WebGLProgram, glResource: WebglResource) {
        this.id = id;
        this.glProgram = glProgram;
        this.glResource = glResource;
        this.cacheAttrShaderPosition = {};
        this.cacheUniformShaderPosition = {};
    }

    PreloadProperties(gl : WebGLRenderingContext, config : ShaderConfigType) {
        this.PreloadAttributeProperties(gl, config.attributes);
        this.PreloadUniformProperties(gl, config.uniforms);
        this.PreloadUniformTexture(gl, config.texture);
    }
    
    //Attribute
    private PreloadAttributeProperties(gl : WebGLRenderingContext, properties : ShaderAttributConfigType) {
        Object.keys(properties).forEach(key => {
            var attributes = gl.getAttribLocation(this.glProgram, key);
            let buffer = gl.createBuffer();

            //If this data won't change anymore, and data value is number array
            // if (properties[key].drawType == gl.STATIC_DRAW && properties[key].value != null) {
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array((properties[key].value as number[]) ), gl.STATIC_DRAW);
            
            this.cacheAttrShaderPosition[key] = {position_id : attributes, buffer : buffer, vertexPointer : properties[key].vertexPointer};
        });
    }

    //Uniform
    private PreloadUniformProperties(gl : WebGLRenderingContext, properties : string[]) {
        let pCount = properties.length;

        for (let i = 0; i < pCount; i++) {
            let uniform = (gl.getUniformLocation(this.glProgram, properties[i]));

            //Might be null, if frag shader didn't use this property at all
            if (uniform != null) {
                this.cacheUniformShaderPosition[properties[i]] = uniform;
            }
        }
    }

    private PreloadUniformTexture(gl : WebGLRenderingContext, properties : string[]) {
        let pCount = properties.length;

        for (let i = 0; i < pCount; i++) {
            let uniform = (gl.getUniformLocation(this.glProgram, properties[i]));

            //Might be null, if frag shader didn't use this property at all
            if (uniform != null) {
                this.cacheUniformShaderPosition[properties[i]] = uniform;

                let texture = gl.createTexture();
                gl.bindTexture(gl.TEXTURE_2D, texture);

                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                              new Uint8Array([255, 255, 255, 255]));

                this.glResource.SaveGLTextureSource(this.id+properties[i], texture, uniform, gl.TEXTURE0);
            }
        }
    }

    ExecuteAttributeProp(gl : WebGLRenderingContext, attribute_name : string, dynamicArray? : number[]) {
        if (!(attribute_name in this.cacheAttrShaderPosition)) return;

        let cacheAttr = this.cacheAttrShaderPosition[attribute_name];

        if (cacheAttr.position_id < 0) return;

        gl.enableVertexAttribArray(cacheAttr.position_id);   

        // Bind the position buffer.
        gl.bindBuffer(gl.ARRAY_BUFFER, cacheAttr.buffer);

        if (dynamicArray != null) {
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(dynamicArray), gl.DYNAMIC_DRAW);
        }

        // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
        var size = cacheAttr.vertexPointer.size;          // 2 components per iteration
        var type = cacheAttr.vertexPointer.type;   // the data is 32bit floats
        var normalize = cacheAttr.vertexPointer.normalize; // don't normalize the data
        var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
        var offset = 0;        // start at the beginning of the buffer
        gl.vertexAttribPointer(cacheAttr.position_id, size, type, normalize, stride, offset)
    }

    /**
     * https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/uniform
     * Uniform Function are too many, I will leave it for the user to decide which function to call
     * @param {string} attribute_name
     * @param {*} dataset
     * @param {GLUniformFunction} uniformAction
     * @returns
     * @memberof Material
     */
    ExecuteUniformProp(attribute_name : string, dataset : any, uniformAction : any, isMatrixOperation = false) {
        if (!(attribute_name in this.cacheUniformShaderPosition)) return;

        let cacheUnifPoint = this.cacheUniformShaderPosition[attribute_name];
        if (!isMatrixOperation)
            uniformAction(cacheUnifPoint, dataset);
        else
            uniformAction(cacheUnifPoint, false, dataset)
    }

    ExecuteUniformSprite(gl : WebGLRenderingContext, uniform_name : string, sprite :HTMLImageElement) {
        
        //If texture path is not update, then ignore
        if (this.glResource.GetGLTextureSource(this.id+uniform_name) == null) return;
        let glTextureDataSet = this.glResource.GetGLTextureSource(this.id+uniform_name);
        
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

        gl.activeTexture(glTextureDataSet.globalIndex);      
        gl.bindTexture(gl.TEXTURE_2D, glTextureDataSet.texture);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    
        gl.texImage2D(gl.TEXTURE_2D, 0,  gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, sprite);

        gl.uniform1i(glTextureDataSet.uniformLocation, glTextureDataSet.localIndex);
    }

    ExecuteUniformTex(gl : WebGLRenderingContext, uniform_name : string, texture :WebGLTexture) {
        if (!(uniform_name in this.cacheUniformShaderPosition)) return;

        let cacheUnifPoint = this.cacheUniformShaderPosition[uniform_name];

        
    }
}

export default Material;