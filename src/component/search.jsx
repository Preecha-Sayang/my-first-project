import { Search as SearchIcon } from "lucide-react"; // ใช้ icon จาก lucide-react
import { useState } from "react";

function Search() {
    const [isOpen, setIsOpen] = useState(false); 
    const filterbar = ["Highlight", "Cat", "Inspiration", "General"]
  return (
    <>
      <div className="w-[100%] flex flex-col items-center mb-[120px] ">
        <div className="w-[80%] h-[200px] flex flex-col gap-[20px]">

          <h1 className="h-1/2 text-2xl font-semibold">Latest articles</h1>

          <div className="h-1/2 hidden flex-row justify-between items-center px-[40px] bg-gray-100 rounded-3xl md:flex">

            <div className="flex flex-row gap-[20px]">
              {filterbar.map((item, i) => (
                <button
                  key={i}
                  className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-300 hover:text-black transition text-2xl hover:cursor-pointer "
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="flex items-center bg-white px-4 py-2 rounded-xl shadow-sm w-[250px]">
              <input
                type="text"
                placeholder="Search"
                className="flex-1 outline-none bg-transparent text-gray-700"
              />
              <SearchIcon className="w-4 h-4 text-gray-400" />
            </div>
          {isOpen &&{

          }}
          </div>
        </div>
      </div>
    </>
  );
}

export default Search;