import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import './style.css'

import Stats from 'stats.js'

const stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

const scene = new THREE.Scene();

const geometry = new THREE.PlaneGeometry(10, 10);
const material = new THREE.MeshStandardMaterial({ color: '#444444', metalness: 0, roughness: 0.5 });
const size = {
    width: window.innerWidth,
    height: window.innerHeight
}

const floor = new THREE.Mesh(geometry, material);
floor.receiveShadow = true
floor.rotation.x = -Math.PI * 0.5
scene.add(floor);

const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.61)
hemiLight.position.set(0, 50, 0)
scene.add(hemiLight)
const dirLight = new THREE.DirectionalLight(0xffffff, 0.54)
dirLight.position.set(-8, 12, 8)
dirLight.castShadow = true
dirLight.shadow.mapSize = new THREE.Vector2(1024, 1024)
scene.add(dirLight)

const camera = new THREE.PerspectiveCamera(90, size.width / size.height)
camera.position.set(0, 3, 10)
const canvas = document.querySelector('.canvas')

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

scene.add(camera)

const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(size.width, size.height)

renderer.render(scene, camera)

window.addEventListener('resize', (ev) => {
    size.width = ev.target.innerWidth
    size.height = ev.target.innerHeight
    camera.aspect = size.width / size.height
    camera.updateProjectionMatrix()
    renderer.setSize(size.width, size.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.render(scene, camera)
})


const loader  = new GLTFLoader()

let mixer = null
loader.load('/models/SilverDragonkin/scene.gltf', (gltf) => {
    const gltfScene = gltf.scene
    mixer = new THREE.AnimationMixer(gltfScene)
    const action = mixer.clipAction(gltf.animations[0])
    action.play()
    // gltfScene.scale.set(2, 2, 2)
    // gltfScene.position.y = 2
    scene.add(gltfScene)
})

const clock   = new THREE.Clock
const tick = () => {
    stats.begin();

    const delta = clock.getDelta()

    if (mixer) {
        mixer.update(delta)
    }

    controls.update()
    renderer.render(scene, camera)

    stats.end();

    requestAnimationFrame(
        tick
    )
}
tick()

window.addEventListener('dblclick', () => {
    if (document.fullscreenElement) {
        document.exitFullscreen()
    } else {
        canvas.requestFullscreen()
    }
})
