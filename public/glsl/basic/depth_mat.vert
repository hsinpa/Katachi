precision mediump float;
  
attribute vec3 a_vertex;

uniform mat4 u_MVPMatrix;

void main () {
  vec4 vertex = vec4(a_vertex, 1.0);

  gl_Position =  u_MVPMatrix * vertex;
}