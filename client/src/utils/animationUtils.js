// Fonction utilitaire pour déterminer l'animation à partir de keysPressed
export function getAnimationFromKeys(keysPressed) {
  if (!keysPressed) return "CharacterArmature|Idle";
  const moving = [
    'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
    'KeyW', 'KeyA', 'KeyS', 'KeyD'
  ].some(key => keysPressed[key]);
  return moving ? "CharacterArmature|Run" : "CharacterArmature|Idle";
} 