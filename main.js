import { animate, inView } from 'motion';
import {
  Scene,
  PerspectiveCamera,
  Clock,
  WebGLRenderer,
  MeshLambertMaterial,
  Mesh,
  TorusKnotGeometry,
  AmbientLight,
  DirectionalLight,
  Group,
} from 'three';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { NoiseShader } from './noise-shader';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

import './style.css';

// tag selection

const sneakerTag = document.querySelector('.sneaker');
let currentEffect = 0;
let aimEffect = 0;
let timeOutEffect;

const OBJloader = new OBJLoader();

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

animate('section.content p, section.content img', { opacity: 0 });

inView('section.content', (info) => {
  animate(
    info.target.querySelectorAll('p, img'),
    { opacity: 1 },
    { duration: 1, delay: 1 }
  );
});

// three.js

const clock = new Clock();

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

scene.add(camera);

const loadGroup = new Group();

loadGroup.position.y = -10;

// object import

OBJloader.load(
  'MemoryCard.obj',
  (object) => {
    loadGroup.add(object);
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
  },
  function (error) {
    console.log('An error happened');
  }
);

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

camera.position.z = 6;

// composer (for post processing)

const composer = new EffectComposer(renderer);

const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const noisePass = new ShaderPass(NoiseShader);
noisePass.uniforms.time.value = clock.getElapsedTime();
noisePass.uniforms.effect.value = currentEffect;
noisePass.uniforms.aspectRatio.value = window.innerWidth / window.innerHeight;
composer.addPass(noisePass);

const outputPass = new OutputPass();
composer.addPass(outputPass);

const render = () => {
  controls.update();

  currentEffect += (aimEffect - currentEffect) * 0.02;
  scrollGroup.rotation.set(0, window.scrollY * 0.001, 0);
  noisePass.uniforms.time.value = clock.getElapsedTime();
  noisePass.uniforms.effect.value = currentEffect;
  requestAnimationFrame(render);
  composer.render();
};

const resize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  noisePass.uniforms.aspectRatio.value = window.innerWidth / window.innerHeight;
  renderer.setSize(window.innerWidth, window.innerHeight);
};

const scroll = () => {
  clearTimeout(timeOutEffect);
  aimEffect = 1;

  timeOutEffect = setTimeout(() => {
    aimEffect = 0;
  }, 200);
};

render();

window.addEventListener('resize', resize);
window.addEventListener('scroll', scroll);
