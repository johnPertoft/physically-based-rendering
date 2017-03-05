varying vec3 vNormal;
varying vec3 vWorldPos;
varying vec2 vUv;

varying vec4 v_position;

void main() {
  vNormal = normal;
  vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
  vUv = uv;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  v_position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
