// Updated LoginAdmin component with correct token handling

import { useNavigate } from "react-router-dom";
import axios from "axios";
import { supabase } from "@/supabaseClient";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/authentication"; // เพิ่ม import

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4001";

function LoginAdmin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { fetchUser } = useAuth(); // ดึง fetchUser จาก context

  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleLogin = async () => {
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/auth/admin/login`, {
        email,
        password,
      });

      const data = response.data;
      const access_token = data.access_token;

      await supabase.auth.setSession({
        access_token,
        refresh_token: access_token,
      });

      // เก็บ token และตั้ง axios header ทันที
      localStorage.setItem("token", access_token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;

      // เรียก fetchUser เพื่ออัปเดต context (NavBar จะอ่านจาก context)
      await fetchUser();

      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong.");
      setPassword("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-red-100 rounded-lg p-8 shadow-sm">
          <div className="flex justify-center items-center">
            <img src="/contain/Text.svg" alt="admin_panel" />
          </div>

          <h2 className="text-2xl font-medium text-center mb-8 text-gray-800">
            Log in
          </h2>

          <div className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm text-gray-600 mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
                disabled={loading}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm text-gray-600 mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
                disabled={loading}
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}

            <div>
              <button
                onClick={handleLogin}
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
        </div>
      </div>
    </div>
  );
}

export default LoginAdmin;
