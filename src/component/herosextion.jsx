function Herosection(){
  return(
    <div   id="hero-sction"  className="flex flex-row  pr-[120px] pl-[120px]  pt-[60px] pb-[60px] items-center 
    justify-center gap-[60px] w-full">

      <div id="right-content" className="w-[400px]">
        <h1 >Stay Informed, Stay Inspired</h1>
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
export default Herosection