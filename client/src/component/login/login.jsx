import { useState } from "react";
import { useAuth } from "@/context/authentication";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4001";

export default function UserLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isErrorEmail, setIsErrorEmail] = useState(false);
  const [isErrorPassword, setIsErrorPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    let valid = true;

    if (!email.trim()) {
      setIsErrorEmail("กรุณากรอกอีเมล");
      Swal.fire({ icon: "error", title: "อีเมลไม่ถูกต้อง", text: "กรุณากรอกอีเมลของคุณ" });
      return;
    }
    if (!password.trim()) {
      setIsErrorPassword("กรุณากรอกรหัสผ่าน");
      Swal.fire({ icon: "error", title: "รหัสผ่านว่าง", text: "กรุณากรอกรหัสผ่าน" });
      return;
    }


    if (!valid) return;

    try {
      setError("");
      setLoading(true);

      const result = await login({ email, password });

      if (result && result.error) {
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: result.error,
          confirmButtonColor: "#d33",
        });
      } else {
        Swal.fire({
          icon: "success",
          title: "เข้าสู่ระบบสำเร็จ",
          timer: 1500,
          showConfirmButton: false,
        });
        navigate("/"); // ✅ เปลี่ยนเส้นทางหลัง Login
      }
    } catch (err) {
      setError(err?.message || "Login failed");

      Swal.fire({
        icon: "error",
        title: "Error",
        text: err?.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  // Enter Key
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !loading) {
      handleSubmit();
    }
  };

  // ล้าง Error
  const clearEmailError = () => {
    setIsErrorEmail(false);
    setError("");
  };

  const clearPasswordError = () => {
    setIsErrorPassword(false);
    setError("");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-gray-200 rounded-lg p-8 shadow-sm">
          <h2 className="text-2xl font-medium text-center mb-8 text-gray-800">
            User Login
          </h2>

          {error && (
            <div className="mb-4 text-red-600 text-sm text-center bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm text-gray-600 mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={clearEmailError}
                onKeyDown={handleKeyPress}
                className={`w-full px-3 py-2 border rounded-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400 ${
                  isErrorEmail ? "border-red-500" : "border-gray-300"
                }`}
                disabled={loading}
                autoComplete="email"
              />
              {isErrorEmail && (
                <p className="text-red-500 text-xs mt-1">
                  Please enter a valid email.
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-gray-600 mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={clearPasswordError}
                onKeyDown={handleKeyPress}
                className={`w-full px-3 py-2 border rounded-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400 ${
                  isErrorPassword ? "border-red-500" : "border-gray-300"
                }`}
                disabled={loading}
                autoComplete="current-password"
              />
              {isErrorPassword && (
                <p className="text-red-500 text-xs mt-1">
                  Please enter your password.
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div>
              <button
                onClick={handleSubmit}
                className={`w-full bg-gray-800 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors ${
                  loading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-700"
                }`}
                disabled={loading}
              >
                {loading ? "Logging in..." : "Log in"}
              </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <a href="/SignUp" className="text-gray-800 hover:underline">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
