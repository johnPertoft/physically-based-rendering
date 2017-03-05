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

function loadGeometry(url) {
  const loader = new THREE.OBJLoader();
  return new Promise((resolve, reject) => {
    loader.load(url, (obj) => {
      if (obj)
        resolve(obj);
      else
        reject(new Error("Error loading object"));
    });
  });
}

function loadTexture(url) {
  if (url.toLowerCase().endsWith("jpg")) {
    const loader = new THREE.TextureLoader();
    return new Promise((resolve, reject) => {
      loader.load(url, (t) => {
        resolve(t);
      });
    });

  } else if (url.toLowerCase().endsWith("tga")) {
    const loader = new THREE.TGALoader();
    return new Promise((resolve, reject) => {
      // TODO: why doesnt this loader have a callback?
      resolve(loader.load(url));
    });
  }
}
