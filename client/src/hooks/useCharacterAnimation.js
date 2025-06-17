import { useEffect } from 'react';

export default function useCharacterAnimation(actions, animation) {
  useEffect(() => {
    if (actions && actions[animation]) {
      actions[animation].reset().fadeIn(0.32).play();
      return () => actions[animation]?.fadeOut(0.32);
    }
  }, [actions, animation]);
} 