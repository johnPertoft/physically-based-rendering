attribute float displacement;
varying vec3 norm;

void main() {
  norm = normal;
  vec3 newPosition = position + vec3(displacement) * normal;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
