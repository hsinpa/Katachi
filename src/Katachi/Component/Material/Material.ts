import {GLUniformFunction, ShaderAttributConfigType, GLAttrShaderPosition, GLUniformShaderPosition, ShaderConfigType, GLUniformTextures, UniformProperties, UniformAttrType} from './MaterialTypes';
import {GetGLTexture} from './MaterialHelper';

class Material {
    id : string;
    glProgram : WebGLProgram;

    cacheAttrShaderPosition : GLAttrShaderPosition;
    cacheUniformShaderPosition : GLUniformShaderPosition;

    glTextureCache : GLUniformTextures;

    constructor(glProgram : WebGLProgram) {
        this.id = "";
        this.glProgram = glProgram;
        this.cacheAttrShaderPosition = {};
        this.cacheUniformShaderPosition = {};
        this.glTextureCache = {};
    }

    PreloadProperties(gl : WebGLRenderingContext, config : ShaderConfigType) {
        this.PreloadAttributeProperties(gl, config.attributes);
        this.PreloadUniformProperties(gl, config.uniforms);
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

    ExecuteUniformTex(gl : WebGLRenderingContext, uniform_name : string, sprite :HTMLImageElement) {
        
        if (!(uniform_name in this.cacheUniformShaderPosition)) return;

        //If texture path is not update, then ignore
        if (uniform_name in this.glTextureCache && sprite.src == this.glTextureCache[uniform_name].path) return;

        let texture : WebGLTexture = gl.createTexture();

        let cacheUnifPoint = this.cacheUniformShaderPosition[uniform_name];
        
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

        gl.bindTexture(gl.TEXTURE_2D, texture);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, sprite);

        gl.uniform1i(cacheUnifPoint, 0);
      
        this.glTextureCache[uniform_name] = {
            texture : texture,
            path : sprite.src
        }
    }
}

export default Material;