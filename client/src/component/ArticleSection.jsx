import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL ;

function BlogCard({ category, keyword }) {
  const [data, setData] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [debouncedKeyword, setDebouncedKeyword] = useState(keyword);

  // ✅ Debounce Keyword (พิมพ์แล้วค่อยค้น)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedKeyword(keyword);
    }, 500);
    return () => clearTimeout(handler);
  }, [keyword]);

  // ✅ เมื่อ Category หรือ Keyword เปลี่ยน → เคลียร์ข้อมูลเก่า
  useEffect(() => {
    setPage(1);
    setData([]);
    setHasMore(false);
    setIsLoading(true); // บังคับให้ Spinner ขึ้น
  }, [category, debouncedKeyword]);

  // ✅ Fetch Data
  useEffect(() => {
    async function fetchdata() {
      try {
        setIsLoading(true); // ตั้ง loading ที่จุดเริ่มต้น
        const categoryParam = category.toLowerCase() === "highlight" ? "" : category;
        const result = await axios.get(`${API_URL}/posts`, {
          params: {
            page: page,
            limit: 6,
            category: categoryParam,
            keyword: debouncedKeyword?.trim() || undefined,
          },
        });

        // ⏳ Delay 1 วิ (เฉพาะการดึงครั้งแรกเท่านั้น)
        const delay = page === 1 ? 1000 : 0;
        
        setTimeout(() => {
          if (page === 1) {
            setData(result.data.posts);
          } else {
            setData((prevresult) => [...prevresult, ...result.data.posts]);
          }

          if (result.data.currentPage >= result.data.totalPages) {
            setHasMore(false);
          } else {
            setHasMore(true);
          }

          setIsLoading(false);
        }, delay);
      } catch (e) {
        console.log(e);
        setIsLoading(false); // ตั้ง loading เป็น false เมื่อเกิดข้อผิดพลาด
      }
    }
    fetchdata();
  }, [page, category, debouncedKeyword]);

  function handlePage() {
    setPage((prev) => prev + 1);
  }

  return (
    <div className="w-[100%] flex flex-col justify-center items-center mb-[60px]">
      {/* 🌀 Spinner โหลดหน้าแรก */}
      {isLoading && data.length === 0 && (
        <div className="w-full text-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 mx-auto"></div>
        </div>
      )}
      {/* ❌ ไม่มีข้อมูล */}
      {!isLoading && data.length === 0 && (
        <p className="text-center text-gray-500 w-full py-10">
          ไม่มีข้อมูลที่ต้องการ
        </p>
      )}

      <ul className="grid grid-cols-1 md:grid-cols-2 md:gap-8 list-none p-0 w-full md:w-[70%]">
        {data.map((item) => {
          return (
            <Link key={item.id} to={`/post/${item.id}`}>
              <li>
                <div
                  id="blogcard"
                  className="bg-white md:rounded-2xl md:shadow-lg overflow-hidden  
                  hover:shadow-2xl hover:scale-105 transition-transform duration-300 hover:cursor-pointer
                  pb-[20px]"
                >
                  <img
                    src={item.image}
                    alt="img-blog-card"
                    className="w-full h-[360px] object-contain"
                  />
                  <div id="detail" className="p-6 flex flex-col gap-3">
                    <div
                      id="genres"
                      className="text-sm font-medium text-white bg-indigo-500 px-3 py-1 rounded-full w-fit"
                    >
                      {item.category}
                    </div>
                    <p className="text-xl font-semibold text-gray-900">
                      {item.title}
                    </p>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {item.description}
                    </p>

                    <div
                      id="creater"
                      className="flex items-center gap-3 border-t border-gray-200 pt-4 mt-2"
                    >
                      <img
                        src={item.profile_pic}
                        alt="logo"
                        className="w-8 h-8 rounded-full"
                      />
                      <p className="text-sm font-medium text-gray-800">
                        {item.name} |
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(item.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            </Link>
          );
        })}
      </ul>

      {/* 🔽 ปุ่มโหลดเพิ่ม */}
      {hasMore && (
        <div className="text-center mt-8">
          <button
            onClick={handlePage}
            disabled={isLoading || !hasMore}
            className="hover:text-muted-foreground font-medium underline hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-current"></span>
                Loading...
              </>
            ) : (
              "View more"
            )}
          </button>
        </div>
      )}
    </div>
  );
}

export default BlogCard;
