import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

//scene
const scene = new THREE.Scene();
//camera (fov=75 means how much field we can view)
const camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,100);
camera.position.z=5
//objects
const geometry = new THREE.BoxGeometry(1,1,1);//skeleton
const material = new THREE.MeshBasicMaterial({color:"red"});//the clothes
const mesh = new THREE.Mesh(geometry,material);
//add in the scene
scene.add(mesh)
//renderer
const renderer = new THREE.WebGLRenderer({
    canvas:document.querySelector("#canvas"),
    antialias:true,

});
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))//to get great performance without sacrificing quality
//if our device ratio is mminimum then usse that else only use ratio as 2

renderer.setSize(window.innerWidth,window.innerHeight);

// Add orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Add smooth damping effect

//render
function animate(){
    window.requestAnimationFrame(animate);
    controls.update(); // Update controls in animation loop
    renderer.render(scene,camera)
}
animate();