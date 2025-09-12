import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import NarBar from './component/narbar'
import Herosection from './component/herosection'
import Footer from './component/footer'
import Search from './component/search'
import BlogCard from './component/ArticleSection'






function App() {

    const [category, setCategory] = useState("Highlight");

  return (
    <div className="flex flex-col">
    <NarBar/>
    <Herosection/> 
    <Search category={category} setCategory={setCategory}/>
    <BlogCard category={category}/>
    <Footer/>
    </div>

  )
}

export default App

  
