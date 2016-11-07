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
  camera.position.z = 200;
  renderer.setSize(WIDTH, HEIGHT);
  document.body.appendChild(renderer.domElement);
  
  function drawObject(vertexShaderSrc, 
                      fragmentShaderSrc,
                      geometry,
                      albedoTexture,
                      glossTexture,
                      specularTexture) {
    
    const pbrMaterial = new THREE.ShaderMaterial({
      uniforms: {
        albedoTexture: {type: "t", value: albedoTexture},
        glossTexture: {type: "t", value: glossTexture},
        specularTexture: {type: "t", value: specularTexture}
      },
      vertexShader: vertexShaderSrc,
      fragmentShader: fragmentShaderSrc
    });
    
    /*
    const phongMaterial = new THREE.MeshPhongMaterial(
        {map: albedoTexture});
    */

    // TODO: should there be different materials for the different
    // parts of the dagger?
    _.times(geometry.children.length, (i) => 
        geometry.children[i].material = pbrMaterial); 

    scene.add(geometry);
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.85);
    directionalLight.position.set(10, 0, 50);
    scene.add(ambientLight);
    scene.add(directionalLight);

    const renderLoop = (t) => {
      renderer.render(scene, camera);
      requestAnimationFrame(renderLoop);
    };

    requestAnimationFrame(renderLoop);
  }
 
  Promise.all([
      loadShaderSrc("/shaders/simple.vert"), 
      loadShaderSrc("/shaders/simple.frag"),
      loadGeometry("/models/dagger/Dagger.obj"),
      loadTexture("/models/dagger/Dagger_Albedo.tga"),
      loadTexture("/models/dagger/Dagger_Gloss.tga"),
      loadTexture("/models/dagger/Dagger_Specular.tga")])
    .then((results) => {
      const [vertex_shader_src, 
             fragment_shader_src,
             geometry,
             albedoTexture,
             glossTexture,
             specularTexture] = results;

      drawObject(vertex_shader_src, 
                 fragment_shader_src,
                 geometry,
                 albedoTexture,
                 glossTexture,
                 specularTexture);
    });

  // TODO: 
  // stats box from THREEjs, 
  // movement controls, 
  // lighting controls
  // Background skybox (?) to better show the effects of pbr
}
