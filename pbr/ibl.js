/**
* Functions to precompute irradiance maps for quick lookups 
* of an approximation of indirect lighting at any position
* in the scene.
*/

/**
* Approximation of the diffuse part of the reflectance equation
*/
function computeDiffuseIrradianceMap(gl, envMap) {
	// TODO: need to write a fragment shader for this I guess?
	// render to another framebuffer?

	return new Promise((resolve, reject) => {
		const irradianceMap = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_CUBE_MAP, irradianceMap);
		// TODO: set texture parameters
		//gl.texParameteri(gl.TEXTURE_CUBE_MAP, 

		for (let face = 0; face < 6; face++) {
			//gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + face, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, 
		}

		resolve(null);
	});
}

function computeSpecularIrradianceMap() {

}
