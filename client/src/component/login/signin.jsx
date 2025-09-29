import { useState } from "react";

export default function SignupForm() {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "Email must be a valid email",
    password: "Password must be at least 6 characters"
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));

    // Clear errors when user starts typing
    if (errors[id]) {
      setErrors((prev) => ({
        ...prev,
        [id]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const { name, username, email, password } = formData;

    // ตรวจสอบอีเมล
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      newErrors.email = "Email must be a valid email";
    }

    // ตรวจสอบรหัสผ่าน
    if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async () => {
  if (!validateForm()) return;

  setIsSubmitting(true);

  try {
    const res = await fetch("http://localhost:4001/auth/register", {
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

    alert(`✅ Sign up successful! Welcome, ${data.user.name || data.user.username}!`);

    setFormData({
      name: "",
      username: "",
      email: "",
      password: "",
    });
    setErrors({});
  } catch (err) {
    alert(`❌ Sign up failed: ${err.message}`);
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center p-5 mt-[100px]">
      <div className="bg-gray-200 p-8 rounded-lg w-[80%] text-center shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Sign up</h1>
        
        <div className="space-y-4">
          <div className="text-left">
            <label htmlFor="name" className="block text-sm font-medium text-gray-600 mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="text-left">
            <label htmlFor="username" className="block text-sm font-medium text-gray-600 mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="text-left">
            <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-white rounded-md text-gray-800 focus:outline-none focus:ring-2 ${
                errors.email ? 'border-2 border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div className="text-left">
            <label htmlFor="password" className="block text-sm font-medium text-gray-600 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-white rounded-md text-gray-800 focus:outline-none focus:ring-2 ${
                errors.password ? 'border-2 border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`w-full px-6 py-3 rounded-full font-medium transition-colors mt-6 ${
              isSubmitting
                ? "bg-gray-500 cursor-not-allowed text-white"
                : "bg-gray-800 text-white hover:bg-gray-700"
            }`}
          >
            {isSubmitting ? "Signing up..." : "Sign up"}
          </button>
        </div>

        <div className="mt-6 text-sm text-gray-600">
          Already have an account?{" "}
          <button
            type="button"
            className="text-gray-800 underline font-medium hover:text-blue-600"
          >
            Log in
          </button>
        </div>
      </div>
    </div>
  );
}