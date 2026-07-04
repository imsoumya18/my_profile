import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const LAYERS = [4, 6, 8, 7, 5, 3, 2]
const HSPACE = 1.9
const VSPACE = 0.88

// Seeded pseudo-random so z positions are stable across renders
function seededRand(seed) {
  const x = Math.sin(seed + 1) * 43758.5453
  return x - Math.floor(x)
}

function buildNetwork() {
  const nodes = []
  let seed = 0
  LAYERS.forEach((count, li) => {
    const x = (li - (LAYERS.length - 1) / 2) * HSPACE
    for (let i = 0; i < count; i++) {
      const y = (i - (count - 1) / 2) * VSPACE
      const z = (seededRand(seed++) - 0.5) * 5   // ±2.5 units of depth
      nodes.push(new THREE.Vector3(x, y, z))
    }
  })
  const edges = []
  for (let l = 0; l < LAYERS.length - 1; l++) {
    const aStart = LAYERS.slice(0, l).reduce((s, n) => s + n, 0)
    const bStart = aStart + LAYERS[l]
    for (let a = aStart; a < bStart; a++) {
      for (let b = bStart; b < bStart + LAYERS[l + 1]; b++) {
        edges.push({ a, b })
      }
    }
  }
  return { nodes, edges }
}

function NeuralNet() {
  const { nodes, edges } = useMemo(buildNetwork, [])
  const groupRef = useRef()

  const nodePositions = useMemo(() => {
    const arr = new Float32Array(nodes.length * 3)
    nodes.forEach((v, i) => { arr[i * 3] = v.x; arr[i * 3 + 1] = v.y; arr[i * 3 + 2] = v.z })
    return arr
  }, [nodes])

  const lineGeo = useMemo(() => {
    const pos = new Float32Array(edges.length * 6)
    edges.forEach(({ a, b }, i) => {
      const na = nodes[a], nb = nodes[b]
      pos.set([na.x, na.y, na.z, nb.x, nb.y, nb.z], i * 6)
    })
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    return g
  }, [nodes, edges])

  // Slow continuous multi-axis rotation so the 3D depth is clearly visible
  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    groupRef.current.rotation.y = t * 0.07
    groupRef.current.rotation.x = t * 0.03
    groupRef.current.rotation.z = Math.sin(t * 0.05) * 0.12
  })

  return (
    <group ref={groupRef}>
      <lineSegments>
        <primitive object={lineGeo} attach="geometry" />
        <lineBasicMaterial color="#9c8f74" transparent opacity={0.28} depthWrite={false} />
      </lineSegments>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" array={nodePositions} count={nodes.length} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.1} color="#241c10" transparent opacity={0.55} sizeAttenuation depthWrite={false} />
      </points>
    </group>
  )
}

export default function HeroCanvas({ active = true }) {
  return (
    <Canvas
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      camera={{ position: [0, 0, 13], fov: 42 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 1.5]}
      frameloop={active ? 'always' : 'never'}
    >
      <NeuralNet />
    </Canvas>
  )
}
