import { useFrame } from '@react-three/fiber';
import useCharacterControl from './useCharacterControl';

export default function useMovement(socket, characterId, initialPosition = [0, 0, 0]) {
  // Utilise la logique générique du hook
  const { position, keysPressed, rotation, animation } = useCharacterControl(socket, characterId, initialPosition);

  // Synchronisation avec le rendu (Three.js)
  useFrame(() => {}); // Peut être utilisé pour d'autres effets liés à la frame

  return { position, keysPressed, rotation, animation };
}