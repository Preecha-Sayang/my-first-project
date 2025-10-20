import { useState } from "react";
import { useAuth } from "@/context/authentication";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4001";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isErrorEmail, setIsErrorEmail] = useState(false);
  const [isErrorPassword, setIsErrorPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // เพิ่ม loading state

  const { login } = useAuth();

  const handleSubmit = async () => {
    let valid = true;

    if (!email.trim()) {
      setIsErrorEmail(true);
      valid = false;
    } else {
      setIsErrorEmail(false);
    }

    if (!password.trim()) {
      setIsErrorPassword(true);
      valid = false;
    } else {
      setIsErrorPassword(false);
    }

    if (!valid) return;

    try {
      setError("");
      setLoading(true); // เริ่ม loading
      const result = await login({ email, password });
      
      if (result && result.error) {
        setError(result.error);
      }
    } catch (err) {
      setError(err?.message || "Login failed");
    } finally {
      setLoading(false); // สิ้นสุด loading
    }
  };

  // เพิ่ม Enter key support
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !loading) {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-gray-200 rounded-lg p-8 shadow-sm">
          <h2 className="text-2xl font-medium text-center mb-8 text-gray-800">
            Log in
          </h2>

          {error && (
            <div className="mb-4 text-red-600 text-sm text-center bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm text-gray-600 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress} // เพิ่ม Enter support
                className={`w-full px-3 py-2 border rounded-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 ${
                  isErrorEmail ? "border-red-500" : "border-gray-300"
                }`}
                disabled={loading} // Disable ตอน loading
                autoComplete="email"
              />
              {isErrorEmail && (
                <p className="text-red-500 text-xs mt-1">
                  Please enter a valid email.
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm text-gray-600 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress} // เพิ่ม Enter support
                className={`w-full px-3 py-2 border rounded-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 ${
                  isErrorPassword ? "border-red-500" : "border-gray-300"
                }`}
                disabled={loading} // Disable ตอน loading
                autoComplete="current-password"
              />
              {isErrorPassword && (
                <p className="text-red-500 text-xs mt-1">
                  Please enter your password.
                </p>
              )}
            </div>

            <div>
              <button
                onClick={handleSubmit}
                className={`w-full bg-gray-800 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors ${
                  loading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-700"
                }`}
                disabled={loading} // Disable ตอน loading
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