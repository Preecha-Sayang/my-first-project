import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/context/authentication";
import Swal from "sweetalert2";

function LoginAdmin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorEmail, setErrorEmail] = useState(null);
  const [errorPassword, setErrorPassword] = useState(null);

  const navigate = useNavigate();
  const { loginAdmin, state } = useAuth();
  const { loading } = state;

  const handleLogin = async () => {
    // ❗ Local Validate
    if (!email.trim()) {
      setErrorEmail("กรุณากรอกอีเมล");
      Swal.fire({ icon: "error", title: "อีเมลไม่ถูกต้อง", text: "กรุณากรอกอีเมลของคุณ" });
      return;
    }
    if (!password.trim()) {
      setErrorPassword("กรุณากรอกรหัสผ่าน");
      Swal.fire({ icon: "error", title: "รหัสผ่านว่าง", text: "กรุณากรอกรหัสผ่าน" });
      return;
    }

    const res = await loginAdmin({ email, password });

    if (res?.error) {
      Swal.fire({
        icon: "error",
        title: "เข้าสู่ระบบไม่สำเร็จ",
        text: res.error,
      });
      setPassword("");
      return;
    }

    // ✅ Success
    Swal.fire({
      icon: "success",
      title: "เข้าสู่ระบบสำเร็จ",
      timer: 1500,
      showConfirmButton: false,
    });
    navigate("/admin/dashboard"); // สามารถเปลี่ยน path ได้
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !loading) {
      handleLogin();
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg p-8 shadow-sm">
          <div className="flex justify-center items-center mb-6">
            <img src="/contain/Text.svg" alt="admin_panel" />
          </div>

          <h2 className="text-2xl font-medium text-center mb-8 text-gray-800">
            Log in (Admin)
          </h2>

          <div className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm text-gray-600 mb-2">Email</label>
              <input
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyPress}
                onFocus={() => setErrorEmail(null)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${
                  errorEmail ? "border-red-500" : "border-gray-300"
                }`}
                disabled={loading}
              />
              {errorEmail && <p className="text-red-500 text-xs mt-1">{errorEmail}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm text-gray-600 mb-2">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyPress}
                onFocus={() => setErrorEmail(null)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${
                  errorPassword ? "border-red-500" : "border-gray-300"
                }`}
                disabled={loading}
              />
              {errorPassword && <p className="text-red-500 text-xs mt-1">{errorPassword}</p>}
            </div>

            <div>
              <button
                onClick={handleLogin}
                className={`w-full bg-gray-800 text-white py-2 px-4 rounded-md transition-colors ${
                  loading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-700"
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
