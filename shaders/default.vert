precision highp float;

attribute vec3 a_vertex;
attribute vec3 a_normal;

//uniform mat4 

void main() {
  gl_Position = vec4(a_vertex, 1.0);
}
