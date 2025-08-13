import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import NarBar from './component/narbar'
import Herosection from './component/herosection'
import Footer from './component/footer'
import Search from './component/search'
import Contain from './component/ArticleSection'






function App() {



  return (
    <div className="flex flex-col">
    <NarBar/>
    <Herosection/> 
    <Search/>
    <Contain/>
    {/* <Footer/> */}
    </div>

  )
}

export default App

  
