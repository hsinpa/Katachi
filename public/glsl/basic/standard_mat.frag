  precision mediump float;
  
  uniform float u_time; //World time
  uniform vec4 u_mainColor;
  uniform sampler2D u_mainTex;
  uniform sampler2D u_depthTex;

  varying vec2 v_uv;
  varying vec4 v_color;
  varying vec3 v_normal;

  uniform vec3 u_directionLightDir;
  uniform vec4 u_directionLightColor;
  uniform vec4 u_ambientLightColor;

  void main () {
    vec4 tex = texture2D(u_mainTex, v_uv);
    vec4 depthTex = texture2D(u_depthTex, v_uv);

    float lightAngle = max(0.0, dot(u_directionLightDir, v_normal));

    vec4 color = (u_directionLightColor * lightAngle * tex) + (u_ambientLightColor * tex) * u_mainColor;
    color.r = min(1.0, color.r);
    color.g = min(1.0, color.g);
    color.b = min(1.0, color.b);
    color.a = 1.0;

    gl_FragColor = color; //vec4(v_uv.x, v_uv.y, 0.0, 1.0);
  }