import { useEffect, useRef, useState } from 'react';

export default function useCharacterControl(socket, characterId, initialPosition = [0, 0, 0]) {
  const [position, setPosition] = useState(initialPosition);
  const [keysPressed, setKeysPressed] = useState({});
  const [rotation, setRotation] = useState(0);
  const [animation, setAnimation] = useState("CharacterArmature|Idle");
  const lastEmitTime = useRef(0);
  const EMIT_INTERVAL = 50;

  useEffect(() => {
    const handleKeyDown = (event) => {
      setKeysPressed(prev => ({ ...prev, [event.code]: true }));
    };
    const handleKeyUp = (event) => {
      setKeysPressed(prev => ({ ...prev, [event.code]: false }));
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    const handleFrame = () => {
      const speed = 0.05; // vitesse générique, à adapter
      let newPosition = [...position];
      let moved = false;
      let newRotation = rotation;
      let newAnimation = "CharacterArmature|Idle";

      if (keysPressed['KeyW'] || keysPressed['ArrowUp']) {
        newPosition[2] -= speed;
        newRotation = Math.PI;
        newAnimation = "CharacterArmature|Run";
        moved = true;
      } else if (keysPressed['KeyS'] || keysPressed['ArrowDown']) {
        newPosition[2] += speed;
        newRotation = 0;
        newAnimation = "CharacterArmature|Run";
        moved = true;
      } else if (keysPressed['KeyA'] || keysPressed['ArrowLeft']) {
        newPosition[0] -= speed;
        newRotation = -Math.PI / 2;
        newAnimation = "CharacterArmature|Run";
        moved = true;
      } else if (keysPressed['KeyD'] || keysPressed['ArrowRight']) {
        newPosition[0] += speed;
        newRotation = Math.PI / 2;
        newAnimation = "CharacterArmature|Run";
        moved = true;
      }
      // Diagonales
      if ((keysPressed['KeyW'] || keysPressed['ArrowUp']) && (keysPressed['KeyA'] || keysPressed['ArrowLeft'])) {
        newRotation = 3 * Math.PI / 4;
      }
      if ((keysPressed['KeyW'] || keysPressed['ArrowUp']) && (keysPressed['KeyD'] || keysPressed['ArrowRight'])) {
        newRotation = -3 * Math.PI / 4;
      }
      if ((keysPressed['KeyS'] || keysPressed['ArrowDown']) && (keysPressed['KeyA'] || keysPressed['ArrowLeft'])) {
        newRotation = Math.PI / 4;
      }
      if ((keysPressed['KeyS'] || keysPressed['ArrowDown']) && (keysPressed['KeyD'] || keysPressed['ArrowRight'])) {
        newRotation = -Math.PI / 4;
      }
      // Limites
      newPosition[0] = Math.max(-10, Math.min(10, newPosition[0]));
      newPosition[2] = Math.max(-10, Math.min(10, newPosition[2]));
      setRotation(newRotation);
      setAnimation(newAnimation);
      const now = Date.now();
      if (moved) {
        setPosition(newPosition);
        if (socket && now - lastEmitTime.current > EMIT_INTERVAL) {
          socket.emit('move', {
            position: newPosition,
            keysPressed,
            rotation: newRotation
          });
          lastEmitTime.current = now;
        }
      } else {
        // Si aucune touche n'est pressée, on envoie aussi l'état pour arrêter l'animation
        const anyKeyPressed = Object.values(keysPressed).some(Boolean);
        if (!anyKeyPressed && socket && now - lastEmitTime.current > EMIT_INTERVAL) {
          socket.emit('move', {
            position: newPosition,
            keysPressed: {},
            rotation: newRotation
          });
          lastEmitTime.current = now;
        } else if (socket && now - lastEmitTime.current > EMIT_INTERVAL) {
          // Même sans mouvement, on synchronise la rotation
          socket.emit('move', {
            position: newPosition,
            keysPressed,
            rotation: newRotation
          });
          lastEmitTime.current = now;
        }
      }
    };
    const interval = setInterval(handleFrame, 16); // ~60fps
    return () => clearInterval(interval);
  }, [keysPressed, position, rotation, socket]);

  return { position, keysPressed, rotation, animation };
} 