  precision mediump float;
  
  uniform float u_time; //World time
  uniform vec4 u_mainColor;
  uniform sampler2D u_mainTex;
  uniform sampler2D u_depthTex;
  uniform sampler2D u_normalTex;

  varying vec2 v_uv;
  varying vec4 v_color;
  varying vec3 v_normal;
  varying vec4 v_lightSpacePos;
  varying vec3 v_TBN[3];

  uniform vec3 u_directionLightDir;
  uniform vec4 u_directionLightColor;
  uniform vec4 u_ambientLightColor;
  uniform vec2 u_depthTex_Texel;

  #define PCF_SHADOW true  

  float GetShadowValue(float currentDepth, vec3 projCoords, bool inRange) {
    float bias = -0.006;
    float shadow = 0.0;

    //Percentage-closer filtering
    if (PCF_SHADOW) {
      for(int x = -1; x <= 1; ++x)
      {
          for(int y = -1; y <= 1; ++y)
          {
              float pcfDepth = texture2D(u_depthTex, projCoords.xy + vec2(x, y) * u_depthTex_Texel).r; 
              shadow +=  (inRange && currentDepth + bias > pcfDepth) ? 0.0 : 1.0;        
          }
      }
      shadow /= 9.0;
      return shadow;
    }

    //Hard edge shadow
    float depth = texture2D(u_depthTex, projCoords.xy).r; 
    return  (inRange && currentDepth + bias > depth) ? 0.0 : 1.0;        
  }

  vec4 ShadowMap(vec4 colorTex) {
    vec3 projCoords = v_lightSpacePos.xyz / v_lightSpacePos.w;
        projCoords = projCoords * 0.5 + 0.5; // change to UV coordinate

    bool inRange = 
      projCoords.x >= 0.0 &&
      projCoords.x <= 1.0 &&
      projCoords.y >= 0.0 &&
      projCoords.y <= 1.0;

    vec4 projectedTexColor = vec4(texture2D(u_depthTex, projCoords.xy).rrr, 1);
    float projectedAmount = inRange ? 1.0 : 0.0;

    return mix(colorTex, projectedTexColor, projectedAmount);
  }


  float ShadowCalculation() {
    vec3 projCoords = v_lightSpacePos.xyz / v_lightSpacePos.w;
    projCoords = projCoords * 0.5 + 0.5; // change to UV coordinate
    float currentDepth = projCoords.z;

    bool inRange = 
      projCoords.x >= 0.0 &&
      projCoords.x <= 1.0 &&
      projCoords.y >= 0.0 &&
      projCoords.y <= 1.0;

    return GetShadowValue(currentDepth, projCoords, inRange);
  }

  vec3 GetWorldNormal(vec4 normalTex, vec3 tbn[3]) {
    vec3 surfaceNormal = tbn[2];
    return vec3(tbn[0] * normalTex.r + tbn[1] * normalTex.g + tbn[2] * normalTex.b);
  }

  void main () {
    vec4 tex = texture2D(u_mainTex, v_uv);
    vec4 normalTex = texture2D(u_normalTex, v_uv);

    vec3 mainTexWorldNormal = GetWorldNormal(normalTex, v_TBN);

    float shadowValue = ShadowCalculation();
    float lightAngle = max( dot(-u_directionLightDir, v_normal), 0.0);

    if (length(v_TBN[0]) > 0.1)
      lightAngle = max( dot(-u_directionLightDir, mainTexWorldNormal), 0.0);
      
    vec4 color = (u_directionLightColor * lightAngle * tex * shadowValue ) + (u_ambientLightColor * tex) * u_mainColor;
    color.r = min(1.0, color.r);
    color.g = min(1.0, color.g);
    color.b = min(1.0, color.b);
    color.a = 1.0;

    gl_FragColor = color; //vec4(v_uv.x, v_uv.y, 0.0, 1.0);
  }