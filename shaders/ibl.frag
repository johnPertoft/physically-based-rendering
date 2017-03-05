uniform samplerCube envCubeTexture;

varying vec3 vNormal;
varying vec3 vWorldPos;
varying vec2 vUv;
	
const float PI = 3.14159265;

void main() {
	vec3 up = vec3(0.0, 1.0, 0.0);
	vec3 right = cross(up, vNormal);
	up = cross(normal, right);

	vec3 irradiance = vec3(0.0);

	float sampleDelta = 0.025f;

	float numSamples = 0.0f;
	for (float phi = 0.0; phi < 2.0 * PI; phi += sampleDelta) {
		for (float theta = 0.0; theta < 0.5 * PI; theta += sampleDelta) {
			// Polar to local cartesian coords
			vec3 local = vec3(sin(theta) * cos(phi), sin(theta) * sin(phi), cos(theta));
			
			// World coords
			vec3 sampleDir = local.x * right + local.y * up + local.z * N;

			irradiance += textureCube(envCubeTexture, sampleDir).rgb * cos(theta) * sin(theta); 

			numSamples += 1;
		}
	}
	
	// Normalize
	irradiance = PI * irradiance * (1.0 / numSamples);
	
	// TODO: where do we put this color?	
}
