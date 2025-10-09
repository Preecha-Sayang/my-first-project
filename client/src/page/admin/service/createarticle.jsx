import { useState, useEffect, useRef } from "react";
import { AwardIcon, Upload, X } from "lucide-react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4001";

export default function CreateArticle() {

  const [thumbnailUrl, setThumbnailUrl] = useState(null);
  const [title, setTitle] = useState("");
  const [introduction, setIntroduction] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [categories, isCategories] = useState([]);

  const fileInputRef = useRef(null);

  const handleThumbnailUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;



    // Preview image
    const reader = new FileReader();
    reader.onloadend = () => {
      setThumbnailUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeThumbnail = () => {

    setThumbnailUrl(null); // <- ตัวนี้ถูก
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // clear the input
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/posts/category`); // URL API category ของคุณ
      const data = response.data.categories || [];
      isCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleSubmit = async (status) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login first");
        return;
      }

      const selected = categories.find((cat) => cat.name === category);
      const category_id = selected ? selected.id : null;
      const status_id = status === "draft" ? 1 : 2;

      const payload = {
        image: thumbnailUrl || "", // หรือ URL จริงจาก upload
        category_id,
        title,
        description: introduction,
        content,
        status_id,
      };

      console.log("Sending payload:", payload);

      const response = await axios.post(
        `${API_URL}/posts`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("✅ Post created:", response.data);
    } catch (error) {
      console.error("❌ Error submitting post:", error);

      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Status:", error.response.status);
        console.error("Headers:", error.response.headers);
      }
    }
  };

  async function fetchname(){
    const token = localStorage.getItem("token")
    if (!token) {
      console.log("No token found");
      return;
    }

    try{
      const result = await axios.get(`${API_URL}/auth/get-user`, {
  headers: {
    Authorization: `Bearer ${token}`,  // ส่ง token ในรูปแบบ Bearer token
  },
});
      const data = result.data.name
      console.log(data)
      setAuthorName(data)
    }catch(e){
      console.log(e)
    }
  }
    
 useEffect(() => {
  fetchname()
  fetchCategories(); // โหลด category ด้วยเหมือนเดิม
}, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="p-6 border-b flex justify-between items-center">
        <p className="text-xl font-semibold">
          Create article
        </p>
        <div className="flex flex-row gap-1">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-all"
            onClick={() => handleSubmit("draft")}
          >
            as draft
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-all"
            onClick={() => handleSubmit("published")}
          >
            as publish
          </button>
        </div>
      </div>
      <div className=" mx-20px bg-white rounded-lg shadow-sm p-6">
        {/* Thumbnail Upload */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Thumbnail Image
          </label>
          <div className="flex flex-row items-end gap-[50px]">
            <div className="relative">
              {!thumbnailUrl ? (
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 bg-gray-50 w-[450px] h-[250px]
                flex justify-center items-center"
                >
                  {/* ไม่ให้ผู้ใช้กดอัพโหลดจากตรงนี้ */}
                  <div className="flex flex-col items-center justify-center pointer-events-none select-none">
                    <Upload className="w-12 h-12 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500 mb-4 text-center">
                      Upload thumbnail image
                    </span>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={thumbnailUrl}
                    alt="Thumbnail preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    onClick={removeThumbnail}
                    className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              )}
            </div>
            <div>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleThumbnailUpload}
                className="hidden"
              />

              <button
                type="button"
                className="mt-2 px-4 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                onClick={() =>
                  fileInputRef.current && fileInputRef.current.click()
                }
              >
                Upload thumbnail image
              </button>
            </div>
          </div>
        </div>

        {/* Category */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-[450px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500
            "
          >
            <option value="" disabled>
              Select category
            </option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Author Name */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Author name
          </label>
          <input
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="Thanaphon R."
            className="w-[450px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled
          />
        </div>

        {/* Title */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Article title"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Introduction */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Introduction (max 120 letters)
          </label>
          <textarea
            value={introduction}
            onChange={(e) => {
              if (e.target.value.length <= 120) {
                setIntroduction(e.target.value);
              }
            }}
            placeholder="Introduction"
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
          <div className="text-xs text-gray-500 mt-1 text-right">
            {introduction.length}/120
          </div>
        </div>

        {/* Content */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Content"
            rows="12"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>
      </div>
    </div>
  );
}
