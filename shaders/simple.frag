uniform sampler2D albedoTexture;
uniform sampler2D glossTexture;
uniform sampler2D specularTexture;

varying vec2 vUv;

void main() {
  gl_FragColor = texture2D(albedoTexture, vUv);
}
