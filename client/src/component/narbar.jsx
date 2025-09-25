import { useState } from "react";
import { Link } from "react-router-dom";

function NarBar() {
  const [isOpen, setIsOpen] = useState(false); 

  return (
    <nav className=' fixed top-0 left-0 w-full h-[60px] flex flex-row justify-between items-center px-[60px] md:px-[120px] border-b-2 border-gray-200 bg-white z-50'>
      <img src="/hh..png" alt="logo" className="hover:cursor-pointer" />

      <div className='gap-[8px] hidden md:flex'>
        <Link to={"/login"}>
        <button type="button" className="w-[120px] h-[40px] bg-white border-2 border-gray-400 rounded-4xl flex justify-center items-center hover:cursor-pointer hover:bg-black hover:text-white">
          Login
        </button>
        </Link >
        <Link to={"/SignUp"}>
        <button type="button" className="w-[120px] h-[40px] bg-black text-white rounded-4xl flex justify-center items-center hover:cursor-pointer hover:bg-white hover:border-2 hover:border-gray-400 hover:text-black">
          Sign up
        </button>
        </Link>
      </div>

      {/* Hamburger*/}
      <div className="md:hidden flex items-center">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex flex-col justify-center items-center gap-1"
        >
          <span className={`block w-6 h-0.5 bg-black transition-transform ${isOpen ? "rotate-45 translate-y-1.5" : ""}`}></span>
          <span className={`block w-6 h-0.5 bg-black transition-opacity ${isOpen ? "opacity-0" : "opacity-100"}`}></span>
          <span className={`block w-6 h-0.5 bg-black transition-transform ${isOpen ? "-rotate-45 -translate-y-1.5" : ""}`}></span>
        </button>
      </div>

      {/* Mobile*/}
      {isOpen && (
        <div className="absolute top-[60px] left-0 w-full bg-white flex flex-col items-center gap-4 py-4 border-b-2 border-gray-200 md:hidden">
          <button className="w-[80%] h-[40px] bg-white border-2 border-gray-400 rounded-4xl flex justify-center items-center hover:bg-black hover:text-white">
            Login
          </button>
          <button className="w-[80%] h-[40px] bg-black text-white rounded-4xl flex justify-center items-center hover:bg-white hover:border-2 hover:border-gray-400 hover:text-black">
            Sign up
          </button>
        </div>
      )}
    </nav>
  )
}

export default NarBar;
