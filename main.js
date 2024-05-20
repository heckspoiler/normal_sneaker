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
} from 'three';
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
const keyLight = new DirectionalLight(0xffffff, 1);

keyLight.position.set(-1, 1, 3);

scene.add(ambience, keyLight);

const geometry = new TorusKnotGeometry(1, 0.25, 100, 10);
const material = new MeshLambertMaterial({ color: 0xffff00, wireframe: false });
const cube = new Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

const render = () => {
  cube.rotation.x += 0.005;
  cube.rotation.y += 0.005;
  requestAnimationFrame(render);
  renderer.render(scene, camera);
};
render();
