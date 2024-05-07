import * as THREE from 'THREE'
import './style.css'

const scene = new THREE.Scene();

const geometry = new THREE.BoxGeometry(1, 1, 1);
const size = {
    width: 1000,
    height: 600
}


const meshes = []

const colors = ['red', 'blue', 'yellow']

for (let x = -1.2; x <= 1.2; x = x + 1.2) {
    for (let y = -1.2; y <= 1.2; y = y + 1.2) {
        const color = colors[((Math.random() * 3) | 0)]
        const material = new THREE.MeshBasicMaterial({ color,  wireframe: true });
        const mesh = new THREE.Mesh(geometry, material);

        mesh.position.set(x, y, 0)
        mesh.scale.set(0.5, 0.5, 0.5)

        meshes.push(mesh)
    }
}

const group = new THREE.Group()
group.add(...meshes)
scene.add(group)

const camera = new THREE.PerspectiveCamera(45, size.width / size.height)
scene.add(camera)

camera.position.z = 5
scene.add(camera)

const canvas = document.querySelector('.canvas')
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(size.width, size.height)
renderer.render(scene, camera)

const MAX_SCALE = 1
const MIN_SCALE = 0.5
let grow = true

const clock = new THREE.Clock()
const animation = () => {
    const delta = clock.getDelta()

    meshes.forEach((mesh, index) => {
        const multi = index % 2 ? -1 : 1
        mesh.rotation.x += multi * delta
        mesh.rotation.y += multi * delta * 0.4
    })

    const elapsedTime = clock.getElapsedTime()

    camera.position.x = Math.sin(elapsedTime)
    camera.position.y = Math.cos(elapsedTime)
    camera.lookAt(new THREE.Vector3(0,0,0))

    const multi = grow ? 1 : -1

    group.scale.x += delta * multi * 0.2
    group.scale.y += delta * multi * 0.2
    group.scale.z += delta * multi * 0.2

    if (grow && group.scale.x >= MAX_SCALE) {
        grow = false
    } else if (group.scale.x <= MIN_SCALE) {
        grow = true
    }

    renderer.render(scene, camera)
    requestAnimationFrame(animation)
}

animation()
