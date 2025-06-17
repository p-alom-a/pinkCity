import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export default function IslandModel(props) {
  const gltf = useLoader(GLTFLoader, '/assets/models/Island.glb')
  
  return (
    <group {...props} dispose={null}>
      <primitive 
        object={gltf.scene} 
        scale={0.5}
        position={[0, 0, 0]}
        rotation={[0, 0, 0]}
      />
    </group>
  )
} 