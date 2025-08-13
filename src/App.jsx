import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import NarBar from './component/narbar'
import Herosection from './component/herosextion'





function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
    <NarBar/>
    <Herosection/>
    </div>

  )
}

export default App


