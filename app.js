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
  
  // Just drawing the geometry of the dagger
  function drawDagger(vertexShaderSrc, fragmentShaderSrc) {
    const loader = new THREE.OBJLoader();
    loader.load("models/dagger/Dagger.obj", (obj) => {
      
      const constantColorMaterial = new THREE.ShaderMaterial({
        vertexShader: vertexShaderSrc,
        fragmentShader: fragmentShaderSrc
      });

      const phongMaterial = new THREE.MeshPhongMaterial({color:"green"});

      const basicMaterial = new THREE.MeshBasicMaterial({color:"red"});
      
      _.times(obj.children.length, (i) => obj.children[i].material = phongMaterial); 

      scene.add(obj);
       
      // For Phong lighting
      const light = new THREE.DirectionalLight(0xffffff, 0.55);
      light.position.set(10, 0, 50);
      scene.add(light);

      const renderLoop = (t) => {
        renderer.render(scene, camera);
        requestAnimationFrame(renderLoop);
      };

      requestAnimationFrame(renderLoop);
    });
  }
 
  Promise.all([
      loadShaderSrc("/shaders/simple.vert"), 
      loadShaderSrc("/shaders/simple.frag")])
    .then((shaders) => {
      //drawSomething(shaders[0], shaders[1]);
      drawDagger(shaders[0], shaders[1]);
    });
}
