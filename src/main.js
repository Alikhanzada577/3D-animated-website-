import './style.css';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import gsap from 'gsap';
//scene
const scene = new THREE.Scene();
//camera (fov=75 means how much field we can view)
const camera = new THREE.PerspectiveCamera(40,window.innerWidth/window.innerHeight,0.1,100);
camera.position.z=3.5;

let model ;
// Load HDRI environment map
const rgbeLoader = new RGBELoader();
rgbeLoader.load('https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/pond_bridge_night_1k.hdr', function(texture) {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    // scene.background = texture;
    scene.environment = texture;
    
});

//load gltf model
const loader = new GLTFLoader();
loader.load(
    '/DamagedHelmet.gltf',
    function (gltf) {
        model=gltf.scene;
        scene.add(model);
        // Center and scale the model if needed
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.x = -center.x;
        model.position.y = -center.y;
        model.position.z = -center.z;
        
        // Add some lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(1, 1, 1);
        scene.add(directionalLight);
    },
    function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error) {
        console.error('An error happened:', error);
    }
);

//renderer
const renderer = new THREE.WebGLRenderer({
    canvas:document.querySelector("#canvas"),
    antialias:true,
    alpha:true,
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))//to get great performance without sacrificing quality
//if our device ratio is mminimum then usse that else only use ratio as 2

renderer.setSize(window.innerWidth,window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;

// Add orbit controls
// const controls = new OrbitControls(camera, renderer.domElement);
// controls.enableDamping = true; // Add smooth damping effect

// Post processing setup
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const rgbShiftPass = new ShaderPass(RGBShiftShader);
rgbShiftPass.uniforms['amount'].value = 0.00015;
composer.addPass(rgbShiftPass);

window.addEventListener("mousemove",(e)=>{
    console.log(e.clientX/window.innerWidth,e.clientY/window.innerHeight)
    if (model){
        const rotationX=(e.clientX/window.innerHeight -0.5)*(Math.PI*0.12);
        const rotationY=(e.clientY/window.innerWidth -0.5)*(Math.PI*0.12);
        gsap.to(model.rotation, {
            x: rotationY,
            y: rotationX,
            duration: 0.9,
            ease: "power2.out"
        });
    }
})
window.addEventListener("resize",()=>{
    camera.aspect = window.innerHeight/window.innerWidth;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth,window.innerHeight);
    composer.setSize(window.innerWidth,window.innerHeight);
})
//render
function animate(){
    window.requestAnimationFrame(animate);
    // controls.update(); // Update controls in animation loop
    composer.render(); // Use composer instead of renderer
}
animate();