import {CustomShaderProperties, VertexPointerConfig, GLAttrShaderPosition, GLUniformShaderPosition, ShaderConfigType} from './MaterialType';

type GLUniformFunction = (locationPoint : WebGLUniformLocation, dataset : any) => void;

class Material {
    id : string;
    glProgram : WebGLProgram;
    fragmentShader : WebGLShader;
    vertexShader : WebGLShader;

    cacheAttrShaderPosition : GLAttrShaderPosition;
    cacheUniformShaderPosition : GLUniformShaderPosition;

    constructor(material_id : string, glProgram : WebGLProgram, vertexShader : WebGLShader, fragmentShader : WebGLShader) {
        this.id = material_id;
        this.glProgram = glProgram;
        this.fragmentShader = fragmentShader;
        this.vertexShader = vertexShader;
        this.cacheAttrShaderPosition = {};
        this.cacheUniformShaderPosition = {};
    }

    PreloadProperties(gl : WebGLRenderingContext, config : ShaderConfigType) {
        this.PreloadAttributeProperties(gl, config.attributes);
        this.PreloadUniformProperties(gl, config.uniforms);
    }
    
    //Attribute
    private PreloadAttributeProperties(gl : WebGLRenderingContext, properties : CustomShaderProperties) {
        Object.keys(properties).forEach(key => {

            var attributes = gl.getAttribLocation(this.glProgram, key);
            let buffer = gl.createBuffer();;

            //If this data won't change anymore, and data value is number array
            if (properties[key].drawType == gl.STATIC_DRAW && properties[key].value != null) {
                gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array((properties[key].value as number[]) ), gl.STATIC_DRAW);
            }

            this.cacheAttrShaderPosition[key] = {position_id : attributes, buffer : buffer, vertexPointer : properties[key].vertexPointer};
        });
    }

    //Uniform
    private PreloadUniformProperties(gl : WebGLRenderingContext, properties : string[]) {
        let pCount = properties.length;

        for (let i = 0; i < pCount; i++) {
            var uniform = gl.getUniformLocation(this.glProgram, properties[i]);

            this.cacheUniformShaderPosition[properties[i]] = uniform;
        }
    }

    ExecuteAttributeProp(gl : WebGLRenderingContext, attribute_name : string, dynamicArray? : number[]) {
        if (!this.HasOwnProperty(this.cacheAttrShaderPosition,attribute_name )) return;

        let cacheAttr = this.cacheAttrShaderPosition[attribute_name];

        gl.enableVertexAttribArray(cacheAttr.position_id);   

        // Bind the position buffer.
        gl.bindBuffer(gl.ARRAY_BUFFER, cacheAttr.position_id);

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
    ExecuteUniformProp(attribute_name : string, dataset : any, uniformAction : GLUniformFunction) {
        if (!this.HasOwnProperty(this.cacheUniformShaderPosition, attribute_name )) return;

        let cacheUnifPoint = this.cacheUniformShaderPosition[attribute_name];

        uniformAction(cacheUnifPoint, dataset);
    }

    private HasOwnProperty<X extends {}, Y extends PropertyKey>
    (obj: X, prop: Y): obj is X & Record<Y, unknown> {
        return obj.hasOwnProperty(prop)
    }
}

export default Material;