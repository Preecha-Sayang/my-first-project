import axios from "axios";
import { useState } from "react";
const API_URL = import.meta.env.VITE_API_URL ;

function CreateCatrgory() {
  const [cat, iscat] = useState("");

  async function createcat() {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first");
      return;
    }
    if (!cat.trim()) {
      alert("Please enter a category name");
      return;
    }
    const payload = { name: cat };
    try {
      const result = await axios.post(
        `${API_URL}/posts/category`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("✅ Post created:", result.data);
    } catch (e) {
      console.log(e);
    }
  }
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="p-6 border-b flex justify-between items-center">
        <p className="text-xl font-semibold">Category</p>
        <div className="flex flex-row gap-1">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-all"
            onClick={createcat}
          >
            Save
          </button>
        </div>
      </div>
      <div className="flex flex-col  py-10 px-12 gap-[20px]">
        <label htmlFor="categorycreate"> Category name</label>
        <input
          type="text"
          placeholder="Category name"
          className="w-[480px] h-[50px] bg-gray-50 border rounded-xl
            p-[10px]"
          value={cat}
          onChange={(e) => iscat(e.target.value)}
        />
      </div>
    </div>
  );
}

export default CreateCatrgory;
