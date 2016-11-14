window.onload = () => {
  const NEAR = 0.1;
  const FAR = 10000;
  const VIEW_ANGLE = 45;

  const WIDTH = 800;
  const HEIGHT = 600;
  const ASPECT = WIDTH / HEIGHT;

  const renderer = new THREE.WebGLRenderer();
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
      VIEW_ANGLE,
      ASPECT,
      NEAR,
      FAR);

  scene.add(camera);
  camera.position.z = 400;
  renderer.setSize(WIDTH, HEIGHT);
  document.body.appendChild(renderer.domElement);
  
  // Camera movement controls
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableZoom = true; //false;
      
  function drawObject(
      vertexShaderSrc, 
      fragmentShaderSrc,
      objGeometry,
      albedoTexture,
      glossTexture,
      specularTexture,
      cubemapTexture) {
   
    // Cubemap for ambient lighting in scene
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
        specularTexture: {type: "t", value: specularTexture}
      },
      vertexShader: vertexShaderSrc,
      fragmentShader: fragmentShaderSrc
    });
    
    /*
    // This apparently uses envMap as IBL and shades it much darker
    const tempMaterial = new THREE.MeshStandardMaterial({
      envMap: environmentCamera.renderTarget.texture});
    */

    // Set scale and materials of object
    objGeometry.scale.set(2, 2, 2);
    _.times(objGeometry.children.length, (i) => 
        objGeometry.children[i].material = pbrMaterial); 
   
    scene.add(objGeometry);

    const renderLoop = (t) => {
      renderer.render(scene, camera);
      requestAnimationFrame(renderLoop);
    };

    // Start the rendering loop
    requestAnimationFrame(renderLoop);
  }
 
  // Note: the gloss texture for the dagger encodes gloss (what is gloss really?), ao (ambient occlusion?), and cavity (??) in its 3 channels
  // TODO: should we use the normal texture for the dagger? or just use the computed ones?

  Promise.all([
      loadShaderSrc("/shaders/pbr.vert"), 
      loadShaderSrc("/shaders/pbr.frag"),
      loadGeometry("/resources/dagger/Dagger.obj"),
      loadTexture("/resources/dagger/Dagger_Albedo.tga"),
      loadTexture("/resources/dagger/Dagger_Gloss.tga"),
      loadTexture("/resources/dagger/Dagger_Specular.tga"),
      loadTexture("/resources/cubemap.jpg")])
    .then((results) => {
      drawObject(...results);
    });

  // TODO:
  // maybe use other model, we dont have a metalness texture with this one for example
  // Other terminology, specular -> metalness for instance?
  // stats box from THREEjs
  // write about image based lighting, which I guess is kind of what we are doing with the environment map?
  // should probably have some direct lights as well
  // run everything fullscreen, (update projectionmatrix etc.. on size change)
  // path tracing for better reflections?
  // lighting controls
  // controls for switching shading techniques
}
