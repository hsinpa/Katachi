precision mediump float;

attribute vec3 a_vertex;

uniform mat4 u_MVPMatrix;
uniform float u_scale;

void main () {
    vec3 scaleVertex = a_vertex * 1.1;
    vec4 vertex = vec4(scaleVertex, 1.0);

    gl_Position =  u_MVPMatrix * vertex;
}