import { blogPosts } from "/src/data/data-containner.jsx";
import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";




function BlogCard({ category, keyword }) {
  const [data, setData] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [debouncedKeyword, setDebouncedKeyword] = useState(keyword);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedKeyword(keyword);
      setPage(1); 
    }, 500); 

    return () => clearTimeout(handler);
  }, [keyword]);
  
  //
  useEffect(() => {
    async function fetchdata() {
       setIsLoading(true);
      try {
        const categoryParam = category === "Highlight" ? "" : category;
        const result = await axios.get("https://blog-post-project-api.vercel.app/posts", {
            params: {
              page: page,
              limit: 6,
              category: categoryParam,
              keyword: debouncedKeyword?.trim() || undefined
            }
          });
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
      } catch (e) {
        console.log(e);
      }finally {
        setIsLoading(false); 
      }
    }
    fetchdata();
  }, [page, category, debouncedKeyword]);




  const filteredData = data;

    function handlePage(){
      setPage((prev)=>prev+1)
    }



  return (
    <div className="w-[100%] flex flex-col justify-center items-center mb-[60px]">
    <ul className="grid grid-cols-1 md:grid-cols-2 md:gap-8 list-none p-0 w-full md:w-[70%]  ">
      {filteredData.map((item, index) => {
        return (
          <li key={index}>
            <div
              id="blogcard"
              className="bg-white md:rounded-2xl md:shadow-lg overflow-hidden  
              hover:shadow-2xl hover:scale-105 transition-transformtransition-shadow duration-300 hover:cursor-pointer
              pb-[20px] pb:md-0"
            >
              <Link to={`/post/${item.id}`}>
              <img
                src={item.image}
                alt="img-blog-card"
                className="w-full h-[360px] object-contain"
              />
              </Link>
              <div id="detail" className="p-6 flex flex-col gap-3">
                <div
                  id="genres"
                  className="text-sm font-medium text-white bg-indigo-500 px-3 py-1 rounded-full w-fit"
                >
                  {item.category}
                </div>
                <Link to={`/post/${item.id}`}>
                <p className="text-xl font-semibold text-gray-900">
                  {item.title}
                </p>
                </Link>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {item.description}
                </p>

                <div
                  id="creater"
                  className="flex items-center gap-3 border-t border-gray-200 pt-4 mt-2"
                >
                  <img
                    src="/herosection.png"
                    alt="logo"
                    className="w-8 h-8 rounded-full"
                  />
                  <p className="text-sm font-medium text-gray-800">
                    {item.author}
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
        );
      })}
    </ul>
          {hasMore && (
            <div className="text-center mt-8">
              <button
                onClick={()=>{handlePage()}}
                disabled={isLoading || !hasMore}
                className="hover:text-muted-foreground font-medium underline"
              >
               {isLoading ? "Loading..." : hasMore ? "View more" : "No more posts"}
              </button>
            </div>
          )}
    </div>
  );
}

export default BlogCard;
