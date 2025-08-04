import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function NarBar(){
  return(
    <nav className=' max-w-full h-[60px] flex flex-row justify-between items-center pr-[120px] pl-[120px]
    border-b-2 border-brown-400 '  >
      <img src="/hh..png" alt="logo" />
      <div  className='gap-[8px] flex '>
        <button type="button"  className=" w-[120px] h-[40px] bg-white border-2 border-black rounded-4xl flex justify-center items-center" >Login </button>
        <button type="button"  className=" w-[120px] h-[40px] bg-black text-white rounded-4xl flex justify-center items-center">Sign up</button>
      </div>

    </nav>
  )
}


function Herosection(){
  return(
    <div   id="hero-sction"  className="flex flex-row  pr-[120px] pl-[120px]  pt-[60px] pb-[60px] items-center 
    justify-center gap-[60px] w-full">

      <div id="right-content" className="w-[400px]">
        <h1>Stay Informed, Stay Inspired</h1>
        <p>Discover a World of Knowledge at Your Fingertips. Your Daily Dose of Inspiration and Information.</p>
      </div>

      <img src="./herosection.png" alt="hero-section-img" />

      <div id="left-content">
        <div id="author">
          <p>-Author</p>
          <h4>Thompson P.</h4>
        </div>
        <div id="content" className="w-[400px]">
            <p>I am a pet enthusiast and freelance writer who specializes in animal behavior and care. With a 
              deep love for cats, I enjoy sharing insights on feline companionship and wellness. </p>
            <p>When i'm not writing, I spends time volunteering at my local animal shelter, helping cats 
              find loving homes.</p>
        </div>
      </div>
    </div>
  )
}


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


