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
      blurredCubemapTexture,
      irradianceMapTexture) {

    // Add the cubemap to scene
    cubemapTexture.mapping = THREE.UVMapping;
    const cubemapMesh = new THREE.Mesh(
        new THREE.SphereGeometry(500, 32, 16),
        new THREE.MeshLambertMaterial({map: cubemapTexture}));
    cubemapMesh.scale.x = -1;
    scene.add(cubemapMesh);

    const pointLight = new THREE.PointLight( 0xffffff, 100, 100 );
    pointLight.position.set( 250, 250, 0 );
    scene.add( pointLight );

    const pointLight2 = new THREE.PointLight( 0xffffff, 100, 100 );
    pointLight2.position.set( -250, 250, 0 );
    scene.add( pointLight2 );

    const sphereSize = 100;
    const pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );
    const pointLightHelper2 = new THREE.PointLightHelper( pointLight2, sphereSize );
    scene.add( pointLightHelper );
    scene.add( pointLightHelper2 );

    // TODO: should probably just load a texture cube instead of creating
    // it on the fly since its not changing anyway but in this way we can
    // have another object in the scene to be visible in reflection which
    // is nice for the demo I guess.
    // Get an environment map to use for reflections
    const environmentCamera = new THREE.CubeCamera(1, 10000, 256);
    scene.add(environmentCamera);
    environmentCamera.updateCubeMap(renderer, scene);

    const uniforms = THREE.UniformsUtils.merge([
      THREE.UniformsLib['lights'],
    {
      envCubeTexture: {
        type: "t",
        value: environmentCamera.renderTarget.texture
      },
      blurredEnvCubetexture: {
        type: "t", value: blurredCubemapTexture},
      albedoTexture: {
        type: "t", value: albedoTexture},
      glossTexture: {
        type: "t", value: glossTexture},
      specularTexture: {
        type: "t", value: specularTexture},
      normalTexture: {
        type: "t", value: normalTexture}
    }]);
    // Custom material using the basic PBR shader
    const pbrMaterial = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: vertexShaderSrc,
      fragmentShader: fragmentShaderSrc,
      lights: true
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
