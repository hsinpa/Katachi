  precision mediump float;
  
  uniform float u_time; //World time
  uniform vec4 u_mainColor;

  varying vec2 v_uv;
  varying vec4 v_color;
  varying vec3 v_normal;

  void main () {
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
  }