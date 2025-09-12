import { Search as SearchIcon } from "lucide-react"; // ใช้ icon จาก lucide-react
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


function Search() {
  const [isOpen, setIsOpen] = useState(true);
  const [category, setCategory] = useState("Highlight"); 
  const filterbar = ["Highlight", "Cat", "Inspiration", "General"]
  return (
    <>
      <div className="w-[100%] flex flex-col items-center mb-[60px] ">
        <div className="w-[100%] md:w-[80%] md:h-[160px] flex flex-col gap-[20px]">

            {/* header */}
          <h1 className="pl-[20px] md:h-1/2 !text-3xl md:!text-4xl !font-bold ">Latest articles</h1>
          {/* Desktop */}
          <div className="h-1/2 hidden flex-row justify-between items-center px-[40px] bg-gray-100 rounded-3xl md:flex">

            <div className="flex flex-row gap-[20px]">
              {filterbar.map((item, i) => (
                <button
                  key={i}
                  className={`px-4 py-2 rounded-xl text-gray-600  text-2xl  
                  ${category === item?"bg-gray-300 text-black font-bold":"hover:bg-gray-300 transition hover:cursor-pointer"}
                  `}
                
                  disabled={category === item}
                  value={item} onClick={()=>setCategory(item)}
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
          </div>

              {/* Mobile */}
              {isOpen && (
                <div className="flex md:hidden flex-col justify-center bg-gray-100 p-4 space-y-4">

                <div className="flex items-center bg-white px-4 py-2 rounded-xl shadow-sm w-[100%]">
                  <input
                    type="text"
                    placeholder="Search"
                    className="flex-1 outline-none bg-transparent text-gray-700"
                  />
                  <SearchIcon className="w-4 h-4 text-gray-400" />
                </div>
                  <p className="text-gray-700">Category</p>
                <div className="md:hidden w-full">
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="w-full py-3 rounded-sm text-muted-foreground">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {filterbar.map((item) => (
                        <SelectItem
                          key={item}
                          value={item}
                        >
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              )}
        </div>
      </div>
    </>
  );
}

export default Search;