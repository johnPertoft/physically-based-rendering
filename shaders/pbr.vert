varying vec3 vNormal;
varying vec3 vWorldPos;
varying vec2 vUv;

void main() {
  vNormal = normal;
  vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
  vUv = uv;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
