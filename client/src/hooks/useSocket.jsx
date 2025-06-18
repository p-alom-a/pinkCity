import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useSetAtom } from "jotai";
import { atom } from "jotai";

export const characterAtom = atom([]);
export const currentPlayerIdAtom = atom(null);

export const UseSocket = ({ pseudo }) => {
  const setCharacters = useSetAtom(characterAtom);
  const setCurrentPlayerId = useSetAtom(currentPlayerIdAtom);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!pseudo) return;

    // Crée un socket unique pour cet onglet
    const socket = io(
      import.meta.env.DEV ? 'http://localhost:8080' : undefined,
      { query: { pseudo } }
    );
    socketRef.current = socket;

    const onConnect = () => setCurrentPlayerId(socket.id);
    const onCharacters = (value) => setCharacters(value);
    const onCharacterUpdate = (update) => {
      setCharacters(prev => {
        const idx = prev.findIndex(c => c.id === update.id);
        if (idx === -1) return prev;
        const updated = { ...prev[idx], ...update };
        const arr = [...prev];
        arr[idx] = updated;
        return arr;
      });
    };

    socket.on("connect", onConnect);
    socket.on("characters", onCharacters);
    socket.on("character:update", onCharacterUpdate);

    return () => {
      socket.off("connect", onConnect);
      socket.off("characters", onCharacters);
      socket.off("character:update", onCharacterUpdate);
      socket.disconnect();
    };
  }, [pseudo, setCharacters, setCurrentPlayerId]);

  return socketRef.current;
};