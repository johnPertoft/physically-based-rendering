function loadShaderSrc(url) {
  return new Promise((resolve, reject) => {
    let client = new XMLHttpRequest();
    client.open("GET", url);
    client.onload = () => {
      if (client.status == 200) 
        resolve(client.response);
      else 
        reject(new Error("Error loading shader"));
    };

    client.send();
  });
}

function loadGeometry() {
  const loader = THREE.OBJLoader();
}

function loadTexture() {

}
