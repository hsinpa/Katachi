  precision mediump float;
  
  uniform float u_time; //World time
  uniform vec4 u_mainColor;
  uniform sampler2D u_mainTex;

  varying vec2 v_uv;
  varying vec4 v_color;
  varying vec3 v_normal;

  void main () {
    vec4 tex = texture2D(u_mainTex, v_uv);
    vec4 color = tex * u_mainColor;
    color.a = 1.0;

    gl_FragColor = color; //vec4(v_uv.x, v_uv.y, 0.0, 1.0);
  }