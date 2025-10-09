import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Upload, X } from "lucide-react";
import axios from "axios";

export default function EditArticle({ postId }) {
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailUrl, setThumbnailUrl] = useState(null);

  const [title, setTitle] = useState("");
  const [introduction, setIntroduction] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [statusId, setStatusId] = useState(2); // default draft

  const fileInputRef = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4001";


  // ✅ โหลดข้อมูลบทความจาก postId
  const fetchPost = async () => {
    try {
      const res = await axios.get(`${API_URL}/posts/${postId}`);
      const post = res.data;

      setTitle(post.title);
      setIntroduction(post.description);
      setContent(post.content);
      setThumbnailUrl(post.image);
      setCategory(post.category);
      setStatusId(post.status === "publish" ? 1 : 2);
    } catch (err) {
      console.error("Error loading post:", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_URL}/posts/category`);
      setCategories(res.data.categories || []);
    } catch (err) {
      console.error("Error loading categories:", err);
    }
  };

  const handleThumbnailUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setThumbnailFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setThumbnailUrl(reader.result);
    reader.readAsDataURL(file);
  };

  const removeThumbnail = () => {
    setThumbnailFile(null);
    setThumbnailUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (status) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("Please login first");

      const selected = categories.find((c) => c.name === category);
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

      await axios.put(`${API_URL}/posts/${postId}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Article updated successfully");
    } catch (err) {
      console.error("Error updating article:", err);
      alert("Update failed");
    }
  };





  useEffect(() => {
    fetchCategories();
    fetchPost();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="p-6 border-b flex justify-between items-center">
        <p className="text-xl font-semibold">Edit Article</p>
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

      <div className="mx-20 bg-white rounded-lg shadow-sm p-6">
        {/* Thumbnail */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Thumbnail Image
          </label>
          <div className="flex flex-row items-end gap-[50px]">
            <div className="relative">
              {!thumbnailUrl ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 bg-gray-50 w-[450px] h-[250px] flex justify-center items-center">
                  <div className="flex flex-col items-center justify-center pointer-events-none">
                    <Upload className="w-12 h-12 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500 text-center">
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
            className="w-[450px] px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Title */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Article title"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Introduction */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Introduction (max 120)
          </label>
          <textarea
            value={introduction}
            onChange={(e) => {
              if (e.target.value.length <= 120) setIntroduction(e.target.value);
            }}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 resize-none"
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
            rows="10"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>
      </div>
    </div>
  );
}
