import { blogPosts } from "/src/data/data-containner.jsx";

function BlogCard() {
  return (
    <div className="w-[100%] flex flex-col justify-center items-center mb-[60px]">
    <ul className="grid grid-cols-1 md:grid-cols-2 gap-8 list-none p-0 w-[70%] ">
      {blogPosts.map((item) => {
        return (
          <li key={item.id}>
            <div
              id="blogcard"
              className="bg-white rounded-2xl shadow-lg overflow-hidden  
              hover:shadow-2xl hover:scale-105 transition-transformtransition-shadow duration-300 hover:cursor-pointer
              "
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
                    src="/herosection.png"
                    alt="logo"
                    className="w-8 h-8 rounded-full"
                  />
                  <p className="text-sm font-medium text-gray-800">
                    {item.author}
                  </p>
                  <p className="text-xs text-gray-500">{item.date}</p>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
    </div>
  );
}

export default BlogCard;
