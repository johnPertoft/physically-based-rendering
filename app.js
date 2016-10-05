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
  camera.position.z = 300;
  renderer.setSize(WIDTH, HEIGHT);
  document.body.appendChild(renderer.domElement);
 
  function drawSomething(vShaderSrc, fShaderSrc) {
    // Temp, just drawiVng something
    let radius = 50;
    let segments = 64;
    let rings = 64;
    let sphereMaterial = new THREE.ShaderMaterial(
        {
          vertexShader: vShaderSrc,
          fragmentShader: fShaderSrc
        }
    );
    
    let sphere = new THREE.Mesh(
        new THREE.SphereGeometry(radius, segments, rings),
        sphereMaterial);

    scene.add(sphere);

    let pointLight = new THREE.PointLight(0xFFFFFF);
    pointLight.position.x = 10;
    pointLight.position.y = 50;
    pointLight.position.z = 130;

    scene.add(pointLight);
    
    const renderLoop = (t) => {
      scale = 0.5 + Math.abs(Math.sin(t / 1000));
      sphere.scale.x = 1 * scale;
      sphere.scale.y = 1 * scale;
      sphere.scale.z = 1 * scale;
      
      renderer.render(scene, camera);
      requestAnimationFrame(renderLoop);
    };

    requestAnimationFrame(renderLoop);
  }

  Promise.all([
      loadShaderSrc("/shaders/simple.vert"), 
      loadShaderSrc("/shaders/simple.frag")])
    .then((shaders) => {
      drawSomething(shaders[0], shaders[1]);
    });
}
