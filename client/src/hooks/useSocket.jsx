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
    const socket = io({
      query: { pseudo }
    });
    socketRef.current = socket;

    const onConnect = () => setCurrentPlayerId(socket.id);
    const onCharacters = (value) => setCharacters(value);

    socket.on("connect", onConnect);
    socket.on("characters", onCharacters);

    return () => {
      socket.off("connect", onConnect);
      socket.off("characters", onCharacters);
      socket.disconnect();
    };
  }, [pseudo, setCharacters, setCurrentPlayerId]);

  return socketRef.current;
};