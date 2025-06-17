import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useSetAtom } from "jotai";
import { atom } from "jotai";

export const characterAtom = atom([]);
export const currentPlayerIdAtom = atom(null);

let socket = null;

export const UseSocket = ({ pseudo }) => {
  const setCharacters = useSetAtom(characterAtom);
  const setCurrentPlayerId = useSetAtom(currentPlayerIdAtom);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!pseudo) return;

    socket = io("http://localhost:3001", { query: { pseudo } });
    socketRef.current = socket;
    
    const onConnect = () => {
      console.log("connected to server");
      setCurrentPlayerId(socket.id);
    };

    const onDisconnect = () => {
      // console.log("disconnected from server");
    };

    const onHello = () => {
      // console.log("hello from server");
    };

    const onCharacters = (value) => {
      // console.log("Received characters:", value);
      setCharacters(value);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("hello", onHello);
    socket.on("characters", onCharacters);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("hello", onHello);
      socket.off("characters", onCharacters);
      socket.disconnect();
    };
  }, [pseudo, setCharacters, setCurrentPlayerId]);

  return socketRef.current;
};