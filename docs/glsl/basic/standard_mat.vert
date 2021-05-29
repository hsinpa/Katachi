precision mediump float;
  
attribute vec3 a_vertex;
attribute vec2 a_uv;
attribute vec4 a_color;
attribute vec3 a_normal;
attribute vec4 a_tangent;

varying vec2 v_uv;
varying vec4 v_worldVertex;
varying vec3 v_normal;
varying vec4 v_color;
varying vec4 v_lightSpacePos;
varying vec3 v_TBN[3];

uniform mat4 u_modelMatrix;
uniform mat4 u_inverseTransposeModelMatrix;
uniform mat4 u_MVPMatrix;
uniform mat4 u_lightSpaceMVPMatrix;
uniform sampler2D u_depthTex;

void main () {
  vec4 vertex = vec4(a_vertex, 1.0);

  // v_uv = vec2( (a_position + 1.0 )* 0.5 ); // For Image processing effect

  v_uv = a_uv;
  //v_normal = normalize(vec3(u_modelMatrix * vec4(a_normal, 0.0)));
  v_normal = normalize(mat3(u_inverseTransposeModelMatrix) * a_normal);
  v_color = a_color;

  vec3 T = normalize(mat3(u_inverseTransposeModelMatrix) * vec3(a_tangent));
  vec3 B = cross(T, v_normal);

  v_TBN[0] = T;
  v_TBN[1] = B;
  v_TBN[2] = v_normal;

  v_worldVertex = u_modelMatrix * vertex;
  v_lightSpacePos = u_lightSpaceMVPMatrix * (v_worldVertex);
  gl_Position =  u_MVPMatrix * vertex;
}