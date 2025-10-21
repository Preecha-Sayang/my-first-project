
import  { useState, useEffect } from "react";
import axios from "axios";
import { Search, Edit2, Trash2 } from "lucide-react";


const API_URL = import.meta.env.VITE_API_URL ;


function CategoriesManage({setisCategories}) {
    const [categories, setCategories] = useState([]);
const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/posts/category`); // URL API category ของคุณ
      const data = response.data.categories || [];
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
      fetchCategories();
    }, []);

const handleDelete = async (categoryid) => {
    if (!confirm("Are you sure you want to delete this article?")) return;

    try {
      await axios.delete(`${API_URL}/posts/${categoryid}/category`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      alert("Article deleted successfully");
      fetchCategories();
    } catch (error) {
      console.error("Error deleting article:", error);
      alert("Failed to delete article");
    }
  };




  return (
    <div>
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="p-6 border-b flex justify-between items-center">
          <p className="text-xl font-semibold">Category</p>
          <div className="flex flex-row gap-1">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-all"
            onClick={()=>setisCategories(true)}
            >
              Create Categoty
            </button>
          </div>
        </div>
        <div>
        <div className="relative mt-[20px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search..."
           className="w-[360px] pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>
        <div className="mt-[20px]">
            <table className="w-full bg-gray-50 border border-gray-200">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Article title
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {categories.map((cat) => (
                    <tr
                      key={cat.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-md truncate">
                          {cat.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={()=> handleDelete(cat.id)}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
        </div>
        </div>
      </div>
    </div>
  );
}

export default CategoriesManage;
