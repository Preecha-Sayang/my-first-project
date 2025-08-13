function Search(){
    return(
    <>
    <div className="w-[100%] flex flex-col  items-center mb-[120px]">
        <div className="w-[70%] h-[200px] flex flex-col gap-[20px]">
            <h1 className=" h-1/2">Latest articles</h1>
            <div className=" h-1/2 flex flex-row  justify-between items-center px-[70px] bg-gray-200">
                <div className="flex flex-row gap-[50px]">
                    <p id="search-al">Highlight</p>
                    <p id="search-al" >Cat</p>
                    <p id="search-al" >Inspiration</p>
                    <p id="search-al" >Ganeral</p>
                </div>
                <p>search</p>
            </div>
        </div>
    </div>
    </>
    )
}
export default Search