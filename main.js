// Libs
import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

// Setup

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);
camera.position.setX(-3);

renderer.render(scene, camera);

// Lights

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(6, 5, 10);

const pointLight1 = new THREE.PointLight(0xffffff);
pointLight1.position.set(3, 3, 50);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, pointLight1);

// Helpers

// const lightHelper = new THREE.PointLightHelper(pointLight)
// const lightHelper1 = new THREE.PointLightHelper(pointLight1)
// const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(lightHelper, lightHelper1, gridHelper)

// Stars

function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(4)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(200));

  star.position.set(x, y, z);
  scene.add(star);
}

Array(250).fill().forEach(addStar);

// Background

const spaceTexture = new THREE.TextureLoader().load('black.jpg');
scene.background = spaceTexture;

// Smoke Detector GLTF
const loader = new GLTFLoader();

loader.load(
  'scene.glb',
  function (gltf) {

             scene.add(gltf.scene);
             gltf.scene.position.set(-7,0,25)
             gltf.scene.rotation.x += 1.5;
             gltf.scene.rotation.y += 6;
             gltf.scene.rotation.z += -1.1;

  },
  (xhr) => {
      console.log((xhr.loaded / xhr.total * 100) + '% loaded')
  },
  (error) => {
      console.log(error);
  }
);

// Earth

const earthTexture = new THREE.TextureLoader().load('earth.jpg');
const normalTexture = new THREE.TextureLoader().load('earthnormal.jpg');

const earths = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: earthTexture,
    normalMap: normalTexture,
  })
);

scene.add(earths);

earths.position.z = 2;
earths.position.setX(5);

// Image of Smoke Detector

const cubeImage = new THREE.TextureLoader().load('smkdtr.png');

const cube = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 3), new THREE.MeshBasicMaterial({ map: cubeImage }));

scene.add(cube);

cube.position.z = 56
cube.position.x = -2
cube.rotation.y = 6

// Scroll Animation

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  earths.rotation.x += 0;
  earths.rotation.y += 0.075;
  earths.rotation.z += 0;
  
  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.0002;
}

document.body.onscroll = moveCamera;
moveCamera();

// Animation Loop

function animate() {
  requestAnimationFrame(animate);
  earths.rotation.y += 0.005;

  // controls.update();

  renderer.render(scene, camera);
}

animate();
