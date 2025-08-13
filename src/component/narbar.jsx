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

export default NarBar