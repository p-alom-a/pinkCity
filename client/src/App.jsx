import './App.css'
import { Island } from './scenes/Island'
import Map from './scenes/Map'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Map />} />
        <Route path="/island" element={<Island />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
