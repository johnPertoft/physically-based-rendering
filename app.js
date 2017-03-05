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

  Promise.all([
      loadShaderSrc("/shaders/pbr.vert"),
      loadShaderSrc("/shaders/pbr.frag"),
      loadGeometry("/resources/dagger/Dagger.obj"),
      loadTexture("/resources/dagger/Dagger_Albedo.tga"),
      loadTexture("/resources/dagger/Dagger_Gloss.tga"),
      loadTexture("/resources/dagger/Dagger_Specular.tga"),
      loadTexture("/resources/dagger/Dagger_Normals.tga"),
      loadTexture("/resources/cubemap.jpg")])
    .then(resources => {
      const envMap = resources[7];
      return Promise.all([
        ...resources,
        computeDiffuseIrradianceMap(renderer.context, envMap)]);
    })
    .then((resources) => {

      // TODO: generate the irradiance map
      const irradianceMapTexture = null;


      const pbrScene = new PBRScene(
          scene,
          renderer,
          camera,
          ...resources);
      const renderLoop = (t) => {
        pbrScene.render();
        requestAnimationFrame(renderLoop);
      };

      // Start the rendering loop
      requestAnimationFrame(renderLoop);
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
