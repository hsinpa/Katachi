  precision mediump float;
  
  uniform float u_time; //World time
  uniform vec4 u_mainColor;
  uniform sampler2D u_mainTex;
  uniform sampler2D u_depthTex;

  varying vec2 v_uv;
  varying vec4 v_color;
  varying vec3 v_normal;
  varying vec4 v_lightSpacePos;

  uniform vec3 u_directionLightDir;
  uniform vec4 u_directionLightColor;
  uniform vec4 u_ambientLightColor;

  float ShadowCalculation(vec4 lightSpacePos) {
    vec3 projCoords = lightSpacePos.xyz / lightSpacePos.w;
    projCoords = projCoords * 0.5 + 0.5; // change to UV coordinate

    float closestDepth = texture2D(u_depthTex, projCoords.xy).r;   

    // get depth of current fragment from light's perspective
    float currentDepth = projCoords.z;
    // check whether current frag pos is in shadow
    float shadow = currentDepth > closestDepth  ? 1.0 : 0.0;

    return shadow;
  }

  void main () {
    vec4 tex = texture2D(u_mainTex, v_uv);
    vec4 depthTex = texture2D(u_depthTex, v_uv);
    
    vec4 depthColor = vec4(depthTex.x, depthTex.x, depthTex.x, 1.0);

    float lightAngle = max( dot(-u_directionLightDir, v_normal), 0.0);

    float shadow = 1.0 - ShadowCalculation(v_lightSpacePos);       

    vec4 color = (u_directionLightColor * lightAngle * tex) + (shadow * u_ambientLightColor * tex) * u_mainColor;
    color.r = min(1.0, color.r);
    color.g = min(1.0, color.g);
    color.b = min(1.0, color.b);
    color.a = 1.0;

    gl_FragColor = vec4(shadow, shadow, shadow, 1.0); //color; //vec4(v_uv.x, v_uv.y, 0.0, 1.0);
  }