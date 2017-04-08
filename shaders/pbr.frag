uniform samplerCube envCubeTexture;
uniform sampler2D albedoTexture;
uniform sampler2D glossTexture;
uniform sampler2D specularTexture;
uniform sampler2D normalTexture;

varying vec3 vNormal; // Guess we dont need this?
varying vec3 vWorldPos;
varying vec2 vUv;

const float PI = 3.14159265;


float distributionGGX(vec3 N, vec3 H, float roughness) {
  float a = roughness * roughness;
  float a2 = a * a;
  float NdotH = max(dot(N, H), 0.0);
  float NdotH2 = NdotH * NdotH;

  float nom = a2;
  float denom = NdotH * (a2 - 1.0) + 1.0;
  denom = PI * denom * denom;

  return nom / denom;
}


float geometrySchlickGGX(float NdotV, float roughness) {
  float r = roughness + 1.0;
  float k = (r * r) / 8.0;

  float nom = NdotV;
  float denom = NdotV * (1.0 - k) + k;

  return nom / denom;
}


float geometrySmith(vec3 N, vec3 V, vec3 L, float roughness) {
  float NdotV = max(dot(N, V), 0.0);
  float NdotL = max(dot(N, V), 0.0);
  float ggx2 = geometrySchlickGGX(NdotV, roughness);
  float ggx1 = geometrySchlickGGX(NdotL, roughness);

  return ggx1 * ggx2;
}


vec3 fresnelSchlick(float cosTheta, vec3 F0) {
  return F0 + (1.0 - F0) * pow(1.0 - cosTheta, 5.0);
}


void main() {
  vec3 cameraToVertex = normalize(vWorldPos - cameraPosition);
  vec3 envCoord = reflect(cameraToVertex, vNormal);
  
  // Texture information
  vec3 albedo = texture2D(albedoTexture, vUv).rgb;
  vec4 specular = texture2D(specularTexture, vUv);
  vec4 gloss_ao_cavity = texture2D(glossTexture, vUv);
  vec3 normal = texture2D(normalTexture, vUv).xyz;
  float gloss = gloss_ao_cavity.r;
  float ambient_occlusion = gloss_ao_cavity.g;
  float cavity = gloss_ao_cavity.b;

  float metallic = specular.r; // temp, how do we use specular?
  vec3 F0 = vec3(0.04);
  F0 = mix(F0, albedo, metallic);

  // TEMP static light source
  vec3 lightPosition = vec3(0.0, 3.0, 0.0);
  vec3 lightColor = vec3(10.0, 0.0, 0.0);

  // Reflectance equation
  vec3 Lo = vec3(0.0);
  vec3 N = normalize(vNormal);
  vec3 L = normalize(vWorldPos - lightPosition);
  vec3 V = -cameraToVertex;
  vec3 H = normalize(V + L);
  float distance = length(lightPosition - vWorldPos);
  float attenuation = 1.0 / (distance * distance);
  vec3 radiance = lightColor * attenuation;
  float roughness = 1.0 - gloss; // ???
  
  // Cook Torrance BRDF
  float NDF = distributionGGX(N, H, roughness);
  float G = geometrySmith(N, V, L, roughness);
  vec3 F = fresnelSchlick(max(dot(H, V), 0.0), F0);

  vec3 nominator = NDF * G * F;
  float denominator = 4.0 * max(dot(N, V), 0.0) * max(dot(N, L), 0.0) + 0.001;
  vec3 brdf = nominator / denominator;

  vec3 kS = F;
  vec3 kD = vec3(1.0) - kS;
  kD *= 1.0 - metallic;

  float NdotL = max(dot(N, L), 0.0);
  Lo += (kD * albedo / PI + brdf) * radiance * NdotL;
  
	// TODO: use IBL here
  vec3 ambient = vec3(0.03) * albedo * ambient_occlusion; 

  vec3 color = ambient + Lo;

  
  // HDR tonemapping + gamma correction
  color = color / (color + vec3(1.0));
  color = pow(color, vec3(1.0 / 2.2));

  // TODO: how to tie in reflection correctly?
  // reflection
  color += 0.05 * textureCube(envCubeTexture, envCoord).rgb;
  //color += (1.0 - roughness) * textureCube(envCubeTexture, envCoord).rgb;
  //color = vec3(gloss)

  gl_FragColor = vec4(color, 1.0);
}
