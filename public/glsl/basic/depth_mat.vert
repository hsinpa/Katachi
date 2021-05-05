precision mediump float;
  
attribute vec4 a_vertex;
attribute vec4 a_color;
attribute vec3 a_normal;
attribute vec2 a_uv;

uniform mat4 u_MVPMatrix;

void main () {
  
  gl_Position =  u_MVPMatrix * a_vertex;
}