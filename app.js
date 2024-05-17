window.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("renderCanvas");
  const engine = new BABYLON.Engine(canvas, true);

  const createScene = () => {
    const scene = new BABYLON.Scene(engine);

    const camera = new BABYLON.ArcRotateCamera(
      "camera",
      Math.PI / 2,
      Math.PI / 2,
      4,
      BABYLON.Vector3.Zero(),
      scene
    );
    camera.attachControl(canvas, true);

    const light1 = new BABYLON.HemisphericLight(
      "light1",
      new BABYLON.Vector3(1, 1, 0),
      scene
    );
    const light2 = new BABYLON.PointLight(
      "light2",
      new BABYLON.Vector3(0, 1, -1),
      scene
    );

    let extras = [];
    // // Custom GLTF loader extension to parse extras as metadata
    BABYLON.SceneLoader.OnPluginActivatedObservable.add((plugin) => {
      if (plugin.name === "gltf") {
        plugin.onParsedObservable.add((loaderData) => {
          const gltf = loaderData.json;
          if (gltf.meshes) {
            gltf.meshes.forEach((mesh, index) => {
              if (mesh.extras) {
                extras[index] = mesh.extras;
              } else {
                extras[index] = null;
              }
            });
          }
        });
      }
    });

    BABYLON.SceneLoader.Append("", "test.glb", scene, (scene) => {
      scene.executeWhenReady(() => {
        scene.meshes.forEach((mesh, index) => {
          mesh.metadata = extras[index];
        });
      });
    });
    console.log(scene);
    return scene;
  };

  const scene = createScene();

  engine.runRenderLoop(() => {
    scene.render();
  });

  window.addEventListener("resize", () => {
    engine.resize();
  });
});
