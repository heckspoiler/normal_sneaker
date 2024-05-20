import { animate, inView } from 'motion';

import './style.css';

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

import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
