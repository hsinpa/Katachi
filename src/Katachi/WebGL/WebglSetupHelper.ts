import WebglResource from './WebglResource';
import Material from '../Component/Material/Material';
class WebglSetupHelper {
    webglResource : WebglResource

    constructor(webglResource : WebglResource) {
        this.webglResource = webglResource;
    }

    CreateShader(gl : WebGLRenderingContext, type : number, source : string ) {
        var shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS); //COMPILE_STATUS = return success state
        if (success) {
          return shader;
        }

        console.log(gl.getShaderInfoLog(shader));

        gl.deleteShader(shader);

        return null;
    }

    CreateGLProgram(gl : WebGLRenderingContext, vertShader : WebGLShader, fragShader : WebGLShader) {
        var program = gl.createProgram();
        gl.attachShader(program, vertShader);
        gl.attachShader(program, fragShader);

        gl.linkProgram(program);

        var success = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (success) {
          return program;
        }

        console.log(gl.getProgramInfoLog(program));

        gl.deleteProgram(program);

        return null;
    }

    GetMaterial(material_id : string) {
        return this.webglResource.GetCacheSource(material_id);
    }

    CreateMaterial(material_id : string, gl : WebGLRenderingContext, rawVertShader : string, rawFragShader : string) {
        let cacheMat : Material = this.webglResource.GetCacheSource(material_id);

        if (cacheMat != null) return cacheMat;

        let vertexShader = this.CreateShader(gl, gl.VERTEX_SHADER, rawVertShader);
        let fragmentShader = this.CreateShader(gl, gl.FRAGMENT_SHADER, rawFragShader);
        let glProgram = this.CreateGLProgram(gl, vertexShader, fragmentShader);
        let material = new Material(material_id, glProgram, vertexShader, fragmentShader);

        this.webglResource.SaveCacheSource(material_id, material);

        return material;
    }
}

export default WebglSetupHelper;