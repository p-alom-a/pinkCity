import React, { useEffect, useRef, useState } from 'react';

export default function Chat({ socket, pseudo }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const [collapsed, setCollapsed] = useState(true);

  useEffect(() => {
    if (!socket) return;
    const handleMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };
    socket.on('chat message', handleMessage);
    return () => {
      socket.off('chat message', handleMessage);
    };
  }, [socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Désactive la navigation avec WASD/lettres quand l'input du chat est focus
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (document.activeElement === inputRef.current) {
        // Empêche la propagation des touches WASD et espace
        if (["KeyW", "KeyA", "KeyS", "KeyD", "Space"].includes(e.code)) {
          e.stopPropagation();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, []);

  const handleSend = (e) => {
    e.preventDefault();
    if (input.trim() && socket) {
      socket.emit('chat message', { pseudo, message: input });
      setInput('');
    }
  };

  const toggleCollapse = () => setCollapsed((c) => !c);

  return (
    <div style={{
      position: 'absolute',
      bottom: 20,
      left: 20,
      width: 420,
      maxHeight: 420,
      background: 'rgba(255,255,255,0.95)',
      borderRadius: 10,
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 1000,
      fontFamily: 'sans-serif',
      overflow: 'hidden',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #eee', background: '#fafbfc', padding: '4px 10px' }}>
        <span style={{ fontWeight: 'bold', flex: 1 }}>Chat</span>
        <button onClick={toggleCollapse} style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: 18,
          color: '#007bff',
          padding: 0,
        }} title={collapsed ? 'Agrandir' : 'Réduire'}>
          {collapsed ? '▴' : '▾'}
        </button>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: 10, maxHeight: collapsed ? 120 : 300, minHeight: collapsed ? 120 : 300, transition: 'max-height 0.2s, min-height 0.2s' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            marginBottom: 6,
            color: msg.type === 'info' ? '#888' : (msg.pseudo === pseudo ? '#007bff' : '#222'),
            fontStyle: msg.type === 'info' ? 'italic' : 'normal',
            fontWeight: msg.type === 'info' ? 'normal' : 'bold',
            background: msg.type === 'info' ? 'none' : (msg.pseudo === pseudo ? 'rgba(0,123,255,0.08)' : 'rgba(0,0,0,0.03)'),
            borderRadius: 4,
            padding: msg.type === 'info' ? 0 : '2px 6px',
            alignSelf: msg.pseudo === pseudo ? 'flex-end' : 'flex-start',
            maxWidth: '90%',
            wordBreak: 'break-word',
          }}>
            {msg.type === 'info' ? (
              <span>{msg.message}</span>
            ) : (
              <>
                <span style={{ fontWeight: 'bold' }}>{msg.pseudo}:</span> <span>{msg.message}</span>
              </>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSend} style={{ display: 'flex', borderTop: '1px solid #eee', background: '#fafbfc' }}>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Écris un message..."
          style={{ flex: 1, border: 'none', outline: 'none', padding: 10, fontSize: 15, background: 'none', color: 'white', backgroundColor: '#222' }}
        />
        <button type="submit" style={{ background: '#007bff', color: '#fff', border: 'none', padding: '0 18px', fontWeight: 'bold', borderRadius: 0, cursor: 'pointer' }}>Envoyer</button>
      </form>
    </div>
  );
} 