import { animate, inView } from 'motion';
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  MeshLambertMaterial,
  Mesh,
  TorusKnotGeometry,
  AmbientLight,
  DirectionalLight,
  Group,
} from 'three';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import './style.css';

// tag selection

const sneakerTag = document.querySelector('.sneaker');

// motion one

animate(
  'header',
  {
    opacity: [0, 1],
    y: [-100, 0],
  },
  {
    duration: 0.5,
    delay: 0.1,
  }
);

animate(
  'section.new-drop',
  {
    opacity: [0, 1],
    y: [-100, 0],
  },
  {
    duration: 0.5,
  }
);

animate('section.content', { opacity: 0 });

inView('section.content', (info) => {
  animate(info.target, { opacity: 1 }, { duration: 1, delay: 1 });
});

// three.js

const scene = new Scene();
const camera = new PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x00000, 0);
sneakerTag.appendChild(renderer.domElement);

// Lighting

const ambience = new AmbientLight(0xfffffff);

camera.add(ambience);

const keyLight = new DirectionalLight(0xffffff, 1);
keyLight.position.set(-1, 1, 3);

camera.add(keyLight);

const fillLight = new DirectionalLight(0xffffff, 0.5);
fillLight.position.set(1, 1, 3);

camera.add(fillLight);

const backLight = new DirectionalLight(0xffffff, 1);
backLight.position.set(1, 3, -1);

camera.add(backLight);

const geometry = new TorusKnotGeometry(1, 0.25, 100, 10);
const material = new MeshLambertMaterial({ color: 0xffff00, wireframe: false });
const shape = new Mesh(geometry, material);

scene.add(camera);

const loadGroup = new Group();

loadGroup.position.y = -10;
loadGroup.add(shape);

const scrollGroup = new Group();
scrollGroup.add(loadGroup);

scene.add(scrollGroup);

animate(
  (t) => {
    loadGroup.position.y = -10 + 10 * t;
  },
  { duration: 2, delay: 0.5 }
);

// controls

const controls = new OrbitControls(camera, renderer.domElement);

controls.enableZoom = false;
controls.enablePan = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 1;

controls.update();

camera.position.z = 5;

const render = () => {
  controls.update();
  scrollGroup.rotation.set(0, window.scrollY * 0.001, 0);
  requestAnimationFrame(render);
  renderer.render(scene, camera);
};
render();
