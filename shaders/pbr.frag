uniform samplerCube envCubeTexture;

uniform sampler2D albedoTexture;
uniform sampler2D glossTexture;
uniform sampler2D specularTexture;

varying vec3 vNormal;
varying vec3 vWorldPos;
varying vec2 vUv;

void main() {
  gl_FragColor = texture2D(albedoTexture, vUv);
  vec3 cameraToVertex = normalize(vWorldPos - cameraPosition);
  vec3 envCoord = reflect(cameraToVertex, vNormal);
  gl_FragColor = textureCube(envCubeTexture, envCoord);
}
