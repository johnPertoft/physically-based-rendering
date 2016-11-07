varying vec2 vUv;

void main() {
  // Just pass texture coordinate to fragment shader
  vUv = uv;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
