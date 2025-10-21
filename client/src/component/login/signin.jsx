import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const API_URL = import.meta.env.VITE_API_URL ;

export default function SignupForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));

    // Clear error for that field
    if (errors[id]) {
      setErrors((prev) => ({
        ...prev,
        [id]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const { name, username, email, password } = formData;

    if (!name.trim()) newErrors.name = "Name is required";
    if (!username.trim()) newErrors.username = "Username is required";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      newErrors.email = "Email must be a valid email";
    }

    if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

 const handleSubmit = async () => {
  if (!validateForm()) {
    Swal.fire({
      icon: "error",
      title: "Invalid Input",
      text: "Please check your information.",
    });
    return;
  }

  setIsSubmitting(true);

  try {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Registration failed");
    }

    // ✅ สมัครสำเร็จ
    Swal.fire({
      icon: "success",
      title: "Sign up successful!",
      showConfirmButton: "#d33",
    });
      navigate("/login");


    setFormData({
      name: "",
      username: "",
      email: "",
      password: "",
    });
    setErrors({});
  } catch (err) {
    // 🛑 แสดง error ใต้ช่อง Username
    if (err.message === "This username is already taken") {
      setErrors((prev) => ({
        ...prev,
        username: "This username is already taken",
      }));
    } else if(err.message === "User with this email already exists") {
      setErrors((prev) => ({
        ...prev,
        email: "User with this email already exists",
      }));
    }
    else {
        Swal.fire({
        icon: "error",
        title: "Sign up failed",
        text: err.message,
      }
      )};
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center p-5 mt-[100px]">
      <div className="bg-gray-200 p-8 rounded-lg w-[80%] text-center shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Sign up</h1>

        <div className="space-y-4">
          {/* NAME */}
          <div className="text-left">
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-white rounded-md ${
                errors.name ? "border-2 border-red-500" : ""
              }`}
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          {/* USERNAME */}
          <div className="text-left">
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={formData.username}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-white rounded-md ${
                errors.username ? "border-2 border-red-500" : ""
              }`}
            />
            {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
          </div>

          {/* EMAIL */}
          <div className="text-left">
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-white rounded-md ${
                errors.email ? "border-2 border-red-500" : ""
              }`}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          {/* PASSWORD */}
          <div className="text-left">
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-white rounded-md ${
                errors.password ? "border-2 border-red-500" : ""
              }`}
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`w-full px-6 py-3 rounded-full font-medium transition-colors mt-6 ${
              isSubmitting
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-gray-800 text-white hover:bg-gray-700"
            }`}
          >
            {isSubmitting ? "Signing up..." : "Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
}
