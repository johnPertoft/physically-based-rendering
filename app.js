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
  controls.enableZoom = false;
  // TODO: add re rendering here I guess?
  //controls.addEventListener("change", () => console.log("hej"));
      
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

    // Custom material using the basic PBR shader
    const pbrMaterial = new THREE.ShaderMaterial({
      uniforms: {
        albedoTexture: {type: "t", value: albedoTexture},
        glossTexture: {type: "t", value: glossTexture},
        specularTexture: {type: "t", value: specularTexture}
      },
      vertexShader: vertexShaderSrc,
      fragmentShader: fragmentShaderSrc
    });
    
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
  
  Promise.all([
      loadShaderSrc("/shaders/simple.vert"), 
      loadShaderSrc("/shaders/simple.frag"),
      loadGeometry("/resources/dagger/Dagger.obj"),
      loadTexture("/resources/dagger/Dagger_Albedo.tga"),
      loadTexture("/resources/dagger/Dagger_Gloss.tga"),
      loadTexture("/resources/dagger/Dagger_Specular.tga"),
      loadTexture("/resources/cubemap.jpg")])
    .then((results) => {
      drawObject(...results);
    });

  // TODO:
  // stats box from THREEjs
  // run everything fullscreen, (update projectionmatrix etc.. on size change)
  // movement controls, 
  // lighting controls
  // Background skybox (?) to better show the effects of pbr, cubemap is what we need I think? Is it enough to have that as lighting approximation? What is path tracing otherwise, do we need it? How do we get all these cool reflections etc
  // http://www.humus.name/index.php?page=Textures
  // https://www.flickr.com/photos/jonragnarsson/2294472375/
  // controls for switching shading techniques
}
