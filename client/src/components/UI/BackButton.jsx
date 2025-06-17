import { useNavigate } from 'react-router-dom'

export default function BackButton({ to = '/', children = '← Retour', style = {} }) {
  const navigate = useNavigate()
  return (
    <button
      style={{
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 10,
        padding: '10px 18px',
        fontSize: '1rem',
        borderRadius: 8,
        border: 'none',
        background: '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        cursor: 'pointer',
        color: 'black',
        ...style
      }}
      onClick={() => navigate(to)}
    >
      {children}
    </button>
  )
} 