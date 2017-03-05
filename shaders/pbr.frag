uniform samplerCube envCubeTexture;
uniform samplerCube blurredEnvCubeTexture;
uniform sampler2D albedoTexture;
uniform sampler2D glossTexture;
uniform sampler2D specularTexture;
uniform sampler2D normalTexture;

// Lights
struct PointLight {
  vec3 position;
  vec3 color;
};
uniform PointLight pointLights[ NUM_POINT_LIGHTS ];

const float PI = 3.14159265359;

varying vec3 vNormal; // Guess we dont need this?
varying vec3 vWorldPos;
varying vec2 vUv;
varying vec4 v_position;

vec3 fresnelSchlick(float cosTheta, vec3 F0) {
  return F0 + ((1.0 - F0) * pow(1.0 - cosTheta, 5.0));
}

float DistributionGGX(vec3 N, vec3 H, float roughness) {
  float alpha = roughness*roughness;
  float alpha2 = alpha*alpha;
  float NdotH = max(dot(N,H), 0.0);

  float NdotH2 = NdotH*NdotH;

  float nom = alpha2;
  float denom = (NdotH2 * (alpha2 - 1.0) + 1.0);
  denom = PI * denom * denom;

  return nom / denom;
}

float GeometrySchlickGGX(float NdotV, float roughness) {
    float r = (roughness + 1.0);
    float k = (r*r) / 8.0;

    float nom   = NdotV;
    float denom = NdotV * (1.0 - k) + k;

    return nom / denom;
}

float GeometrySmith(vec3 N, vec3 V, vec3 L, float roughness) {
    float NdotV = max(dot(N, V), 0.0);
    float NdotL = max(dot(N, L), 0.0);
    float ggx2  = GeometrySchlickGGX(NdotV, roughness);
    float ggx1  = GeometrySchlickGGX(NdotL, roughness);

    return ggx1 * ggx2;
}

void main() {
  vec4 albedoMap = texture2D(albedoTexture, vUv);
  vec4 specular = texture2D(specularTexture, vUv);
  vec4 gloss_ao_cavity = texture2D(glossTexture, vUv);
  vec3 normal = texture2D(normalTexture, vUv).xyz;

  vec3 albedo = pow(albedoMap.rgb, vec3(2.2));
  float roughness = gloss_ao_cavity.r;
  float ao = gloss_ao_cavity.g;
  float cavity = gloss_ao_cavity.b;
  float metallic = 0.4;

  vec3 N = normalize(vNormal);
  vec3 V = normalize(cameraPosition - vWorldPos);

  vec3 F0 = vec3(0.04);
  F0 = mix(F0, albedo, metallic);

  vec3 L0 = vec3(0,0,0);
  for(int l = 0; l < NUM_POINT_LIGHTS; ++l) {

    // Per light Radiance
    vec3 L = normalize(pointLights[l].position - vWorldPos);
    vec3 H = normalize(V + L);

    float distance = length(pointLights[l].position - vWorldPos);
    float attenuation = 1.0 / (distance * distance);
    vec3 radiance = pointLights[l].color * attenuation;

    // Cook-torrance
    float NDF = DistributionGGX(N, H, roughness);
    float G   = GeometrySmith(N, V, L, roughness);
    vec3 F    = fresnelSchlick(max(dot(H, V), 0.0), F0);

    vec3 kS = F;
    vec3 kD = vec3(1.0) - kS;
    kD *= 1.0 - metallic;

    vec3 nominator    = NDF * G * F;
    float denominator = 4.0 * max(dot(N, V), 0.0) * max(dot(N, L), 0.0) + 0.001;
    vec3 brdf = nominator / denominator;

    // add to outgoing radiance Lo
    float NdotL = max(dot(N, L), 0.0);
    L0 += (kD * albedo / PI + brdf) * radiance * NdotL;
  }

  vec3 ambient = vec3(0.03) * albedo * ao;
  vec3 color = ambient + L0;

  color = color / (color + vec3(1.0));
  color = pow(color, vec3(1.0/2.2));

  gl_FragColor = vec4(color, 1.0);
}
