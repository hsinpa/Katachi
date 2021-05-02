precision mediump float;
  
attribute vec4 a_vertex;
attribute vec2 a_uv;
attribute vec4 a_color;
attribute vec3 a_normal;

varying vec2 v_uv;
varying vec3 v_normal;
varying vec4 v_color;

uniform mat4 u_modelMatrix;
uniform mat4 u_inverseTransposeModelMatrix;
uniform mat4 u_MVPMatrix;

void main () {

  // v_uv = vec2( (a_position + 1.0 )* 0.5 ); // For Image processing effect

  v_uv = a_uv;
  //v_normal = normalize(vec3(u_modelMatrix * vec4(a_normal, 0.0)));
  v_normal = mat3(u_inverseTransposeModelMatrix) * a_normal;
  v_color = a_color;

  gl_Position =  u_MVPMatrix * a_vertex;
}