import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, Sky } from '@react-three/drei'
import { useEffect, useState } from 'react'
import { Model } from '../components/Three/Avatar'
import { useAtom } from 'jotai'
import { characterAtom, currentPlayerIdAtom, UseSocket } from '../hooks/useSocket.jsx'
import { useLocation } from 'react-router-dom'
import ModalPseudo from '../components/UI/ModalPseudo'
import BackButton from '../components/UI/BackButton'
import Ground from '../components/Three/Ground'
import { useSkyParams } from '../hooks/useSkyParams'
import Chat from '../components/UI/Chat'

export function Island() {
  const location = useLocation()
  const pseudoFromNav = location.state?.pseudo || ''
  const [pseudo, setPseudo] = useState(pseudoFromNav)
  const skyParams = useSkyParams()
  const [characters] = useAtom(characterAtom)
  const [currentPlayerId] = useAtom(currentPlayerIdAtom)
  const socket = UseSocket({ pseudo })

  useEffect(() => {
    document.body.style.cursor = 'default'
    
    // Instructions de contrôle
    const handleKeyDown = (e) => {
      if (e.code === 'KeyH') {
        alert('Contrôles:\nWASD ou Flèches directionnelles pour se déplacer\nH pour afficher cette aide');
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [])

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      position: 'fixed',
      top: 0,
      left: 0,
      background: '#87CEEB'
    }}>
      <BackButton />
      {pseudo && socket && (
        <Chat socket={socket} pseudo={pseudo} />
      )}
      <Canvas camera={{ position: [2, 2, 4], fov: 75 }}>
        {!pseudo && (
          <ModalPseudo open={true} onValidate={setPseudo} />
        )}
        
        {pseudo && socket && (
          <>
            <Sky {...skyParams} />
            <ambientLight intensity={1} />
            <directionalLight position={[5, 5, 5]} intensity={1} />
            
            {characters.map((char) => (
              <Model
                key={char.id}
                hairColor={char.hairColor}
                topColor={char.topColor}
                bottomColor={char.bottomColor}
                position={char.position}
                rotation={typeof char.rotation === 'number' ? char.rotation : 0}
                pseudo={char.pseudo || ''}
                isCurrentPlayer={char.id === currentPlayerId}
                socket={socket}
                characterId={char.id}
                keysPressed={char.keysPressed || {}}
              />
            ))}
            
            <Ground />
            <OrbitControls enablePan={false} maxDistance={10} minDistance={2} />
          </>
        )}
      </Canvas>
    </div>
  )
}