import { useState } from 'react'
import './App.css'
import DroneVideoFeed from '../src/pages/DrownVideoFeed'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
        <DroneVideoFeed />
        
    </>
  )
}

export default App
