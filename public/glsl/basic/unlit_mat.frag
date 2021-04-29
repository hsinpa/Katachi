  precision mediump float;
  
  uniform float u_time; //World time
  uniform vec4 u_mainColor;
  uniform sampler2D u_mainTex;

  varying vec2 v_uv;
  varying vec4 v_color;
  varying vec3 v_normal;

  void main () {
    vec4 tex = texture2D(u_mainTex, v_uv);
    gl_FragColor = tex * u_mainColor; //vec4(v_uv.x, v_uv.y, 0.0, 1.0);
  }