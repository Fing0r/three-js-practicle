import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import './style.css'
import TWEEN from "three/addons/libs/tween.module";
import Stats from 'stats.js'
import GUI from 'lil-gui';

const gui = new GUI();

const stats = new Stats();
stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild( stats.dom );

const scene = new THREE.Scene();

const size = {
    width: window.innerWidth,
    height: window.innerHeight
}

const camera = new THREE.PerspectiveCamera(90, size.width / size.height)
camera.position.z = 20
const canvas = document.querySelector('.canvas')

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

scene.add(camera)

const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(size.width, size.height)
renderer.render(scene, camera)


let chooseItem = null
const figures = [
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.BoxGeometry(1, 1, 1),
]

const group = new THREE.Group()

let index = 0
for (let x = -5; x <= 5; x += 5) {
    for (let y = -5; y <= 5; y += 5) {
        const material = new THREE.MeshBasicMaterial({ color: 'blue', wireframe: true });

        const mesh = new THREE.Mesh(figures[index], material)
        mesh.position.set(x, y, 10)
        mesh.index = index
        mesh.basicPosition = new THREE.Vector3(x, y, 10)
        group.add(mesh)
        index += 1
    }
}

scene.add(group)

const raycaster = new THREE.Raycaster()

const handleClick = (event) => {
    const pointer = new THREE.Vector2();
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);

    const intersects = raycaster.intersectObjects(group.children);

    if (intersects.length > 1) {
        return
    }

    if (chooseItem) {
        reset()
    }

    intersects.forEach((item) => {
        item.object.material.color.set('red')
        chooseItem = item.object

        new TWEEN.Tween(item.object.position)
            .to({
                x: 0,
                y: 0,
                z: 18
            }, 500)
            .easing(TWEEN.Easing.Cubic.Out)
            .start()
    })

    renderer.render(scene, camera);
}

window.addEventListener('click', handleClick)

const reset = () => {
    chooseItem.material.color.set('blue')

    new TWEEN.Tween(chooseItem.position)
        .to({
            x: chooseItem.basicPosition.x,
            y: chooseItem.basicPosition.y,
            z: chooseItem.basicPosition.z
        }, 500)
        .easing(TWEEN.Easing.Cubic.Out)
        .start()

    chooseItem = null
}


const clock = new THREE.Clock()
const tick = () => {
    stats.begin();

    const delta = clock.getDelta()

    if (chooseItem) {
        chooseItem.rotation.y += delta
    }

    controls.update()
    TWEEN.update()
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
