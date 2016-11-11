uniform samplerCube envCubeTexture;

uniform sampler2D albedoTexture;
uniform sampler2D glossTexture;
uniform sampler2D specularTexture;

varying vec3 vNormal;
varying vec2 vUv;

void main() {
  gl_FragColor = texture2D(albedoTexture, vUv);
  //gl_FragColor = textureCube(envCubeTexture, vec3(1, 1, 1));
}
