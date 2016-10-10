void main() {
  //vec3 newPosition = position + vec3(displacement) * normal;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
