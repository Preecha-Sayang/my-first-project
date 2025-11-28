import { Search as SearchIcon, ChevronLeft, ChevronRight } from "lucide-react";
import axios from "axios";
import { useState, useEffect, useRef } from "react";

const API_URL = import.meta.env.VITE_API_URL;

function Search({ category, setCategory, keyword, setKeyword }) {
  const [isOpen, setIsOpen] = useState(true);
  const [categories, setCategories] = useState(["highlight"]); // เริ่มด้วย highlight
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const scrollContainerRef = useRef(null);

  // ดึง Categories จาก API แล้วเอามาต่อกับ ["highlight"]
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${API_URL}/posts/category`);
        const categoryNames = res.data.categories.map((cat) => cat.name);
        setCategories(["highlight", ...categoryNames]); // รวม highlight ไว้ก่อนเสมอ
        setLoadingCategories(false);
      } catch (err) {
        console.log("Error fetching categories:", err);
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  // ดึงข้อมูล posts ตาม category และ keyword
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const params = { limit: 6 };
        if (category && category !== "highlight") {
          params.category = category;
        }
        if (keyword && keyword.trim() !== "") {
          params.keyword = keyword.trim();
        }

        const res = await axios.get(`${API_URL}/posts`, { params });
        setSuggestions(res.data.posts);
        setShowSuggestions(false); // เปลี่ยนจาก true เป็น false
      } catch (err) {
        console.log(err);
      }
    };

    fetchPosts();
  }, [category, keyword]);

  // เลือกรายการจาก Suggestions
  const handleSelect = (item) => {
    setKeyword(item.title);
    setInputValue(item.title);
    setShowSuggestions(false);
  };

  // Scroll ไปขวา
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  // Scroll ไปซ้าย
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  // เวลาเริ่มต้นให้เลือก highlight (แสดงข้อมูลทั้งหมด)
  useEffect(() => {
    setCategory("highlight");
    setKeyword("");
    setInputValue("");
  }, [setCategory, setKeyword]);

  // เวลาเลือก category
  const onCategoryClick = (item) => {
    setCategory(item);
    setKeyword("");
    setInputValue("");
  };

  return (
    <div className="w-[100%] flex flex-col items-center mb-[60px]">
      <div className="w-[100%] md:w-[80%] md:h-[160px] flex flex-col gap-[20px]">
        {/* header */}
        <h1 className="pl-[20px] md:h-1/2 !text-3xl md:!text-4xl !font-bold ">
          Latest articles
        </h1>

        {/* Desktop */}
        <div className="h-1/2 hidden flex-row justify-between items-center px-[40px] bg-gray-100 rounded-3xl md:flex gap-4">
          <div className="w-[50%] flex flex-row gap-[20px] ">
            {/* Filterbar with Arrow Navigation */}
            <button
              onClick={scrollLeft}
              className="flex-shrink-0 p-2 hover:bg-gray-300 rounded-lg transition"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>

            <div
              ref={scrollContainerRef}
              className="flex flex-row gap-[10px] overflow-x-hidden"
            >
              {loadingCategories ? (
                <p className="text-gray-500">Loading categories...</p>
              ) : (
                categories.map((item) => (
                  <button
                    key={item}
                    className={`px-4 py-2 rounded-xl text-gray-600 text-2xl whitespace-nowrap transition
                    ${
                      category === item
                        ? "bg-gray-300 text-black font-bold"
                        : "hover:bg-gray-300 hover:cursor-pointer"
                    }`}
                    disabled={category === item}
                    onClick={() => onCategoryClick(item)}
                  >
                    {item === "highlight" ? "Highlight" : item}
                  </button>
                ))
              )}
            </div>

            <button
              onClick={scrollRight}
              className="flex-shrink-0 p-2 hover:bg-gray-300 rounded-lg transition"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>
          </div>

          {/* Search Input */}
          <div className="relative flex items-center bg-white px-4 py-2 rounded-xl shadow-sm w-[250px] flex-shrink-0">
            <input
              type="text"
              placeholder="Search"
              className="flex-1 outline-none bg-transparent text-gray-700"
              value={inputValue}
              onChange={(e) => {
                const value = e.target.value;
                setInputValue(value);
                setKeyword(value.trim());
                setShowSuggestions(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setKeyword(inputValue.trim());
                  setShowSuggestions(false);
                }
              }}
            />
            <SearchIcon className="w-4 h-4 text-gray-400" />

            {/* Dropdown Suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <ul className="absolute top-[110%] left-0 w-full bg-white shadow-lg rounded-lg overflow-hidden z-20">
                {suggestions.map((item, i) => (
                  <li
                    key={i}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                    onClick={() => handleSelect(item)}
                  >
                    {item.title}
                  </li>
                ))}
              </ul>
            )}
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
                value={inputValue}
                onChange={(e) => {
                  const value = e.target.value;
                  setInputValue(value);
                  setKeyword(value.trim());
                  setShowSuggestions(false);
                }}
              />
              <SearchIcon className="w-4 h-4 text-gray-400" />
            </div>

            <p className="text-gray-700">Category</p>
            <div className="md:hidden w-full">
              <select
                value={category}
                onChange={(e) => onCategoryClick(e.target.value)}
                className="w-full py-3 rounded-sm text-muted-foreground"
              >
                {loadingCategories ? (
                  <option disabled>Loading...</option>
                ) : (
                  categories.map((item) => (
                    <option key={item} value={item}>
                      {item === "highlight" ? "Highlight" : item}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Search;
