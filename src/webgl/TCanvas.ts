import * as THREE from 'three'
import { acceleratedRaycast, computeBoundsTree, disposeBoundsTree } from 'three-mesh-bvh'
import { gl } from './core/WebGL'
import fragmentShader from './shaders/planeFrag.glsl'
import vertexShader from './shaders/planeVert.glsl'
import { simulator } from './Simulator'
import { mouse2d } from './utils/Mouse2D'
import { controls } from './utils/OrbitControls'

THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree
THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree
THREE.Mesh.prototype.raycast = acceleratedRaycast

export class TCanvas {
  private raycaster = new THREE.Raycaster()
  private pointer = new THREE.Vector2()
  private position: [number, number] = [0, 0]

  private projectionMesh!: THREE.Mesh

  constructor(private parentNode: ParentNode) {
    this.init()
    this.createObjects()
    gl.requestAnimationFrame(this.anime)
  }

  private init() {
    gl.setup(this.parentNode.querySelector('.three-container')!)
    gl.scene.background = new THREE.Color('#fff')
    gl.camera.position.set(0, 0.2, 0.8)

    controls.premitive.enableZoom = false
    controls.premitive.enablePan = false
    controls.premitive.minPolarAngle = Math.PI / 4
    controls.premitive.maxPolarAngle = Math.PI / 2.1

    this.raycaster.firstHitOnly = true
  }

  private createObjects() {
    const geometry = new THREE.PlaneGeometry(2, 2, 512, 512)
    geometry.applyMatrix4(new THREE.Matrix4().makeRotationX(-Math.PI / 2))
    geometry.computeBoundsTree()
    const material = new THREE.ShaderMaterial({
      uniforms: {
        tSimulator: { value: simulator.texture },
      },
      vertexShader,
      fragmentShader,
      side: THREE.DoubleSide,
    })
    this.projectionMesh = new THREE.Mesh(geometry, material)

    gl.scene.add(this.projectionMesh)
  }

  // ----------------------------------
  // animation
  private intersection() {
    this.raycaster.setFromCamera(this.pointer.set(mouse2d.position[0], mouse2d.position[1]), gl.camera)

    // calculate objects intersecting the picking ray
    const intersects = this.raycaster.intersectObjects([this.projectionMesh])
    if (0 < intersects.length) {
      this.position[0] = intersects[0].uv!.x * 2 - 1
      this.position[1] = intersects[0].uv!.y * 2 - 1
    }
  }

  private anime = () => {
    this.intersection()
    simulator.update(this.position)

    controls.update()
    gl.render()
  }

  // ----------------------------------
  // dispose
  dispose() {
    gl.dispose()
  }
}
