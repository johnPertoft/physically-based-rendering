class PBRScene {

  constructor(
      scene,
      renderer,
      camera,
      vertexShaderSrc,
      fragmentShaderSrc,
      objGeometry,
      albedoTexture,
      glossTexture,
      specularTexture,
      normalTexture,
      cubemapTexture,
      irradianceMapTexture) {
    
    // Add the cubemap to scene
    cubemapTexture.mapping = THREE.UVMapping;
    const cubemapMesh = new THREE.Mesh(
        new THREE.SphereGeometry(500, 32, 16),
        new THREE.MeshBasicMaterial({map: cubemapTexture}));
    cubemapMesh.scale.x = -1;
    scene.add(cubemapMesh);

    // TODO: should probably just load a texture cube instead of creating
    // it on the fly since its not changing anyway but in this way we can 
    // have another object in the scene to be visible in reflection which
    // is nice for the demo I guess.
    // Get an environment map to use for reflections
    const environmentCamera = new THREE.CubeCamera(1, 10000, 256);
    scene.add(environmentCamera);
    environmentCamera.updateCubeMap(renderer, scene);

    // Custom material using the basic PBR shader
    const pbrMaterial = new THREE.ShaderMaterial({
      uniforms: {
        envCubeTexture: {
          type: "t", 
          value: environmentCamera.renderTarget.texture},
        albedoTexture: {type: "t", value: albedoTexture},
        glossTexture: {type: "t", value: glossTexture},
        specularTexture: {type: "t", value: specularTexture},
        normalTexture: {type: "t", value: normalTexture}
      },
      vertexShader: vertexShaderSrc,
      fragmentShader: fragmentShaderSrc
    });
    
    // Set scale and materials of object
    objGeometry.scale.set(2, 2, 2);
    _.times(objGeometry.children.length, (i) => 
        objGeometry.children[i].material = pbrMaterial); 
   
    scene.add(objGeometry);
    
    this.scene = scene;
    this.renderer = renderer;
    this.camera = camera;
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }
}
