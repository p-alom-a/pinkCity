import React, { useState } from 'react'
import { Html } from '@react-three/drei'

export default function ModalPseudo({ open, onValidate }) {
  const [pseudo, setPseudo] = useState('')
  if (!open) return null
  return (
    <Html center zIndexRange={[1000, 0]}>
      <form
        onSubmit={e => {
          e.preventDefault()
          if (pseudo.trim()) onValidate(pseudo.trim())
        }}
        style={{
          background: '#fff',
          padding: 32,
          borderRadius: 12,
          boxShadow: '0 2px 16px rgba(0,0,0,0.2)',
          display: 'flex', flexDirection: 'column', gap: 16,
          minWidth: 300,
          alignItems: 'center'
        }}
      >
        <label style={{ fontWeight: 'bold', fontSize: 18 ,color: 'black'}}>Choisis ton pseudo :</label>
        <input
          autoFocus
          value={pseudo}
          onChange={e => setPseudo(e.target.value)}
          placeholder="Pseudo"
          style={{ padding: 10, fontSize: 16, borderRadius: 6, border: '1px solid #ccc', width: '100%' }}
        />
        <button
          type="submit"
          style={{
            padding: '10px 0',
            fontSize: 16,
            borderRadius: 6,
            border: 'none',
            background: '#007bff',
            color: '#fff',
            cursor: 'pointer',
            fontWeight: 'bold',
            width: '100%'
          }}
        >Valider</button>
      </form>
    </Html>
  )
} 