import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { PCFShadowFilter } from "three/src/nodes/TSL.js";


function main() {
  const modelConfig = [
    {
      path: "./src/assets/models/spaceShip/scene.gltf",
      scale: { x: 0.2, y: 0.2, z: 0.2 },
      desktopPosition: { x: -2, y: 0, z: 0 },
      mobilePosition: { x:0, y: -1, z: 0 },
      rotationLimits: { x: Math.PI / 6, y: Math.PI / 3 },
    },
  ];
  
  let models = []; // Holds the loaded 3D 

  // GLTF Model loader
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");
  loader.setDRACOLoader(dracoLoader);


  function loadModel(config) {
    loader.load(
      config.path,
       (gltf) => {
      const model = gltf.scene;
      model.scale.set(config.scale.x, config.scale.y, config.scale.z);
        adjustModelPosition(model, config.mobilePosition, config.desktopPosition)

      model.rotationLimits = config.rotationLimits;

      model.traverse(
        (child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }

          models.push({model, config});
          scene.add(model);
        },
        undefined,
        (error) =>
          console.error("An error occurred while loading the model:", error)
      );
    });
  }

  modelConfig.forEach((config) => loadModel(config))
  
  const canvas = document.querySelector("canvas");
  const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // Camera setup
  const fov = 40;
  const aspect = window.innerWidth / window.innerHeight; // Dynamic aspect ratio
  const near = 0.1;
  const far = 1000;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 2, 5); // Better positioning for a 3D model
  camera.lookAt(0, 0, 0); // Focus on the scene center

  // Scene setup
  const scene = new THREE.Scene();
  scene.background = new THREE.Color("hsl(240, 4%, 16%)");

  // Mouse position tracking
  const mouse = { x: 0, y: 0 };
  window.addEventListener("mousemove", (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1; // Normalize X to [-1, 1]
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1; // Normalize Y to [-1, 1]
  });

  function getScrollbarWidth() {
    return window.innerWidth - document.documentElement.clientWidth;
  }

  function adjustModelPosition(model, desktopPosition, mobilePosition) {
    if (window.innerWidth < 770) {
      console.log(window.innerWidth);
      
      model.position.set(mobilePosition.x, mobilePosition.y, mobilePosition.z);
    } else {
      console.log(window.innerWidth);
      model.position.set(
        desktopPosition.x,
        desktopPosition.y,
        desktopPosition.z
      );
    }
  }


  // Responsive resizing
  renderer.setSize(window.innerWidth - getScrollbarWidth(), window.innerHeight);
  window.addEventListener("resize", () => {
    models.forEach(({ model, config }) =>
      adjustModelPosition(model, config.desktopPosition, config.mobilePosition)
    );
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(
      window.innerWidth - getScrollbarWidth(),
      window.innerHeight
    );
  });

  // Lighting setup
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(5, 10, 7.5);
  directionalLight.castShadow = true;

  directionalLight.shadow.mapSize.width = 1024;
  directionalLight.shadow.mapSize.height = 1024;
  directionalLight.shadow.camera.near = 0.5;
  directionalLight.shadow.camera.far = 50;
  scene.add(directionalLight);

  const planeGeomatery = new THREE.PlaneGeometry(10, 10);
  const planeMaterial = new THREE.ShadowMaterial({ opacity: 0.5 });
  const planeMesh = new THREE.Mesh(planeGeomatery, planeMaterial);
  planeMesh.receiveShadow = true;
  scene.add(planeMesh);


  


  // Animation and rendering loop
  function render(time) {
    time *= 0.001;
    models.forEach(({model, config}) => {
      if (model) {
        model.rotation.y = time;
      }
    });

    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }

  render();
}

main();
