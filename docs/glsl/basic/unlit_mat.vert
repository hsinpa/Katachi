precision mediump float;
  
attribute vec3 a_vertex;
attribute vec4 a_color;
attribute vec3 a_normal;
attribute vec2 a_uv;

varying vec2 v_uv;
varying vec4 v_color;
varying vec3 v_normal;

uniform mat4 u_modelMatrix;
uniform mat4 u_inverseTransposeModelMatrix;
uniform mat4 u_MVPMatrix;

void main () {
  vec4 vertex = vec4(a_vertex, 1.0);

  // v_uv = vec2( (a_position + 1.0 )* 0.5 ); // For Image processing effect

  v_uv = a_uv;
  v_color = a_color;
  v_normal = a_normal;
  
  gl_Position =  u_MVPMatrix * vertex;
}