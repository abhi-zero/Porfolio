import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

function main() {
  const modelConfigScene1 = [
    {
      path: "./src/assets/models/spaceShip/scene.gltf",
      scale: { x: 0.2, y: 0.2, z: 0.2 },
      desktopPosition: { x: -2, y: -.5, z: 0 },
      mobilePosition: { x: 0, y: -1, z: 0 },
    },
  ];

  const modelConfigScene2 = [
    {
      path: "./src/assets/models/boy/scene.gltf",
      scale: { x: 3, y: 3, z: 3 },
      desktopPosition: { x: 0, y: 0, z: 0 },
      mobilePosition: { x: 0, y: 0, z: 0 },
    },
  ];

   // Function to create a scene
   function createScene(canvasId) {
    const canvas = document.getElementById(canvasId);
    const container = canvas.parentElement;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("hsl(240, 4%, 16%)");

    const fov = 40;
    const aspect = container.offsetWidth / container.offsetHeight;
    const near = 0.1;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 2, 5);
    camera.lookAt(0, 0, 0);

    renderer.setSize(container.offsetWidth, container.offsetHeight);

    return { scene, camera, renderer,container, models: [] };
  }
  
  const scene1 = createScene("scene1");
  const scene2 = createScene("scene2");

  function setupLighting(scene) {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.set(1024, 1024);
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    scene.add(directionalLight);
  }

  function setupGround(scene) {
    const planeGeometry = new THREE.PlaneGeometry(10, 10);
    const planeMaterial = new THREE.ShadowMaterial({ opacity: 0.5 });
    const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
    planeMesh.receiveShadow = true;
    scene.add(planeMesh);
  }
  
  function adjustModelPosition(model, desktopPosition, mobilePosition) {
    if (window.innerWidth < 770) {
      model.position.set(mobilePosition.x, mobilePosition.y, mobilePosition.z);
    } else {
      model.position.set(desktopPosition.x, desktopPosition.y, desktopPosition.z);
    }
  }
  function loadModel(sceneObject, config) {
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");
    loader.setDRACOLoader(dracoLoader);

    loader.load(config.path, (gltf) => {
      const model = gltf.scene;
      model.scale.set(config.scale.x, config.scale.y, config.scale.z);

      adjustModelPosition(model, config.desktopPosition, config.mobilePosition);

      model.userData.desktopPosition = config.desktopPosition;
      model.userData.mobilePosition = config.mobilePosition;

      model.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      sceneObject.models.push(model);
      sceneObject.scene.add(model);
    });
  }

  
  const mouse = {
    x:0,
    y:0
  }
  function animateScene(sceneObject) {
    const { scene, camera, renderer, models} = sceneObject;
    console.log(sceneObject);
    

    function render(time) {
      time *= 0.001;

      sceneObject.models.forEach((model) => {
        if (model) {
          model.rotation.y = time;
          if(scene == scene2.scene){
            // model.rotation.x = mouse.y * Math.PI * 0.1; // Mouse Y affects X-axis rotation
            model.rotation.y = mouse.x * Math.PI * 0.1; // Mouse X affects Y-axis rotation
          }
        }
      });

      renderer.render(scene, camera);
      requestAnimationFrame(render);
    }

    render();
  }

  function handleResize(sceneObject) {
    const { camera, renderer, container, models } = sceneObject;

    const resize = () => {
        const width = container.offsetWidth;
        const height = container.offsetHeight;

        // Update renderer size
        renderer.setSize(width, height);

        // Update camera aspect ratio
        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        // Adjust model positions
        models.forEach((model) => {
            adjustModelPosition(model, model.userData.desktopPosition, model.userData.mobilePosition);
        });

        console.log(`Renderer resized: width=${width}, height=${height}`);
    };

    window.addEventListener("resize", resize);
    resize(); // Initial call to ensure setup
}

  

    window.addEventListener('mousemove',(dets) => {
      mouse.x = (dets.x / window.innerWidth) *2 -1  // [-1 ,1]
      mouse.y = -(dets.y / window.innerHeight) *2 + 1
    })

  setupLighting(scene1.scene);
  setupGround(scene1.scene);
  setupLighting(scene2.scene);
  setupGround(scene2.scene);

  modelConfigScene1.forEach((config) => loadModel(scene1, config));
  modelConfigScene2.forEach((config) => loadModel(scene2, config));
  
  handleResize(scene1);
  animateScene(scene1);
  handleResize(scene2);
  animateScene(scene2);
}

main();
