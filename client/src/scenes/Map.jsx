import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, Center, Text3D, Loader } from '@react-three/drei'
import { Suspense, useState, useEffect } from 'react'
import MapModel from '../components/Three/MapModel'


export default function Scene() {
  const [modelLoaded, setModelLoaded] = useState(false)

  useEffect(() => {
    // Forcer un recalcul du centre après le chargement du modèle
    setModelLoaded(true)
  }, [])

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
    
      <Canvas camera={{ position: [0, 0, 4.5], fov: 75 }}
        style={{ background: '#87ceeb' }}>
        <Suspense fallback={null}>
          {/* Environnement */}
          <Environment preset="city"
            intensity={1}
            environmentRotation={[0, Math.PI, 0]} />
          
          {/* Contrôles orbitaux */}
          <OrbitControls 
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
          />


          <Center cacheKey={modelLoaded}>
            <MapModel 
            position={[0, 0, 0]}
            rotation={[Math.PI / 2.85, 0.3, 0.1]} />
          </Center>
        </Suspense>
      </Canvas>
      <Loader />
    </div>
  )
}
