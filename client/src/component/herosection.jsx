function Herosection(){
  return(
    <>
  <div className="flex flex-col justify-center items-center w-[100%] my-[120px] md:my-[120px] px-4">
    <div   id="hero-sction"  className="flex flex-col  items-center 
      justify-center gap-[40px] w-full md:flex-row md:w-[80%]">
        {/* right */}
      <div id="right-content" className="w-full md:w-1/3 text-center md:text-right flex flex-col gap-4">
        <h1 className="!text-3xl md:!text-4xl !font-bold" >Stay Informed, Stay Inspired</h1>
        <p className="text-gray-600 text-sm md:text-base leading-relaxed">Discover a World of Knowledge at Your Fingertips. Your Daily Dose of Inspiration and Information.</p>
      </div>
        {/* img */}
      <img src="./herosection.png" alt="hero-section-img"  className="w-[90%] h-[500px] md:w-1/3 md:h-[530px] object-contain"/>
        {/* left */}
      <div id="left-content " className="w-full md:w-1/3 flex flex-col gap-4 text-left">
        <div id="author">
          <p className="text-gray-500">-Author</p>
          <h4 className="font-semibold text-lg" >Thompson P.</h4>
        </div>
        <div id="content" className="max-w-[400px] mx-auto md:mx-0">
            <p className="text-sm md:text-base leading-relaxed">I am a pet enthusiast and freelance writer who specializes in animal behavior and care. With a 
              deep love for cats, I enjoy sharing insights on feline companionship and wellness. </p>
            <br/>
            <p className="text-sm md:text-base leading-relaxed">When i'm not writing, I spends time volunteering at my local animal shelter, helping cats 
              find loving homes.</p>
        </div>
      </div>
    </div>
  </div>
  </>
  )
}
export default Herosection

