import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import './style.css'


import GUI from 'lil-gui';
import Stats from 'stats.js'

const stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

const parameters = {
    color: '#ffffff'
}

// const image = new Image()
const loadingManager = new THREE.LoadingManager()
loadingManager.onLoad = () => {
    console.log('onLoad')
}

loadingManager.onProgress = () => {
    console.log('onProgress')
}

loadingManager.onStart = () => {
    console.log('onStart')
}

loadingManager.onError = () => {
    console.log('onError')
}


const textureLoader = new THREE.TextureLoader(loadingManager)
const texture = textureLoader.load('/textures/normal.jpeg')

const gui = new GUI({
    closeFolders: true
});
const scene = new THREE.Scene();

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ map: texture });
const size = {
    width: window.innerWidth,
    height: window.innerHeight
}

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

const positionFolder = gui.addFolder('position')
const scaleFolder = gui.addFolder('scale')

gui.addColor(parameters, 'color').onChange(() => {
    mesh.material.color.set(parameters.color)
})

gui.add(mesh, 'visible')
gui.add(material, 'wireframe')

positionFolder.add(mesh.position, 'x').min(-1).max(1).step(0.1)
positionFolder.add(mesh.position, 'y').min(-1).max(1).step(0.1)
positionFolder.add(mesh.position, 'z').min(-1).max(1).step(0.1)

scaleFolder.add(mesh.scale, 'x').min(0.1).max(10).step(0.1)
scaleFolder.add(mesh.scale, 'y').min(0.1).max(10).step(0.1)
scaleFolder.add(mesh.scale, 'z').min(0.1).max(10).step(0.1)

const camera = new THREE.PerspectiveCamera(90, size.width / size.height)
camera.position.z = 3
const canvas = document.querySelector('.canvas')

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

scene.add(camera)
// camera.lookAt(mesh.position)

const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(size.width, size.height)

renderer.render(scene, camera)

// canvas.addEventListener('mousemove', (evt) => {
//     mouse.x = -(evt.clientX / size.width - 0.5)
//     mouse.y = evt.clientY / size.height - 0.5
// })


window.addEventListener('resize', (ev) => {
    size.width = ev.target.innerWidth
    size.height = ev.target.innerHeight
    camera.aspect = size.width / size.height
    camera.updateProjectionMatrix()
    renderer.setSize(size.width, size.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.render(scene, camera)
})


const tick = () => {
    stats.begin();

    controls.update()
    renderer.render(scene, camera)
    // camera.position.x = Math.sin(mouse.x * Math.PI * 2) * 2
    // camera.position.z = Math.cos(mouse.x * Math.PI * 2) * 2
    // camera.position.y = mouse.y * 2
    // camera.lookAt(mesh.position)
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
