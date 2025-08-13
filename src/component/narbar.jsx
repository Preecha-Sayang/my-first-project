function NarBar(){
  return(
    <nav className=' max-w-full h-[60px] flex flex-row justify-between items-center pr-[120px] pl-[120px]
    border-b-2 border-gray-200 '  >
      <img src="/hh..png" alt="logo" className="hover:cursor-pointer" />
      <div  className='gap-[8px] flex '>
        <button type="button"  className=" w-[120px] h-[40px] bg-white border-2 
         border-gray-400 rounded-4xl flex justify-center items-center hover:cursor-pointer hover:bg-black hover:text-white" 
         >Login </button>

        <button type="button"  className=" w-[120px] h-[40px] bg-black text-white rounded-4xl flex 
        justify-center items-center hover:cursor-pointer hover:bg-white hover:border-2 hover:border-gray-400 hover:text-black"
        >Sign up</button>
      </div>

    </nav>
  )
}

export default NarBar
