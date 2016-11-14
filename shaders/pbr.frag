uniform samplerCube envCubeTexture;
uniform sampler2D albedoTexture;
uniform sampler2D glossTexture;
uniform sampler2D specularTexture;

varying vec3 vNormal;
varying vec3 vWorldPos;
varying vec2 vUv;

/*
vec3 environment_brdf(vec3 specular, float norm_dot_v) {
  const vec4 c0 
}
*/

void main() {
  vec4 albedo = texture2D(albedoTexture, vUv);
  vec4 specular = texture2D(specularTexture, vUv);
  vec4 gloss_ao_cavity = texture2D(glossTexture, vUv);
  float gloss = gloss_ao_cavity.r;
  float ambient_occlusion = gloss_ao_cavity.g;
  float cavity = gloss_ao_cavity.b;
  
  vec3 cameraToVertex = normalize(vWorldPos - cameraPosition);
  vec3 envCoord = reflect(cameraToVertex, vNormal);
  
  gl_FragColor = albedo + textureCube(envCubeTexture, envCoord);
}
