import React, { useState, useEffect } from "react"; // ยังไม่ได้ใช้
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthContext = React.createContext();
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4001";
function AuthProvider(props) {
  const [state, setState] = useState({
    loading: null,
    getUserLoading: null,
    error: null,
    user: null,
  });

  const navigate = useNavigate();

  // ดึงข้อมูลผู้ใช้โดยใช้ Supabase API
  const fetchUser = async () => {
    // เริ่มบอกว่าเริ่มโหลด user
    setState((prevState) => ({ ...prevState, getUserLoading: true }));

    const token = localStorage.getItem("token");
    if (!token) {
      // ถ้าไม่มี token ให้เคลียร์ axios auth header ด้วย
      delete axios.defaults.headers.common["Authorization"];
      setState((prevState) => ({
        ...prevState,
        user: null,
        getUserLoading: false,
      }));
      return null;
    }

    try {
      // ตั้งค่า default header เพื่อให้เรียก API อื่น ๆ ใช้ token ได้ด้วย
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const response = await axios.get(`${API_URL}/auth/get-user`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setState((prevState) => ({
        ...prevState,
        user: response.data,
        getUserLoading: false,
      }));

      return response.data;
    } catch (error) {
      // ล้าง header ถ้าเกิด error (เช่น token ไม่ถูกต้อง)
      delete axios.defaults.headers.common["Authorization"];
      setState((prevState) => ({
        ...prevState,
        error: error.message,
        user: null,
        getUserLoading: false,
      }));
      return null;
    }
  };

  useEffect(() => {
    fetchUser(); // โหลดข้อมูลผู้ใช้เมื่อแอปเริ่มต้น
  }, []);

  // ล็อกอินผู้ใช้
  const login = async (data) => {
    try {
      // ตั้ง loading และบอกว่าจะเริ่มดึงข้อมูล user
      setState((prevState) => ({
        ...prevState,
        loading: true,
        error: null,
        getUserLoading: true,
      }));

      const response = await axios.post(`${API_URL}/auth/login`, data);
      const token = response.data.access_token;
      localStorage.setItem("token", token);

      // ตั้ง default header เพื่อให้ fetchUser หรือ request ถัดไปส่ง token
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // ดึงและตั้งค่าข้อมูลผู้ใช้ก่อนเปลี่ยนหน้า
      await fetchUser();

      // ปรับสถานะ loading ให้เสร็จ และไปหน้าแรกหลังจากได้ user แล้ว
      setState((prevState) => ({ ...prevState, loading: false, error: null }));
      navigate("/");
    } catch (error) {
      setState((prevState) => ({
        ...prevState,
        loading: false,
        getUserLoading: false,
        error: error.response?.data?.error || "Login failed",
      }));
      return { error: error.response?.data?.error || "Login failed" };
    }
  };

   // 🛡 Login เฉพาะ Admin
  const loginAdmin = async ({ email, password }) => {
    try {
      setState((prev) => ({
        ...prev,
        loading: true,
        error: null,
        getUserLoading: true,
      }));

      const response = await axios.post(`${API_URL}/auth/admin/login`, {
        email,
        password,
      });

      const token = response.data.access_token;
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      await fetchUser();
      setState((prev) => ({ ...prev, loading: false, error: null }));
      navigate("/"); // ไปหน้า Home หรือ /admin/dashboard ก็ได้

    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        getUserLoading: false,
        error: error.response?.data?.error || "Login failed",
      }));
      return { error: error.response?.data?.error || "Login failed" };
    }
  };


  // ลงทะเบียนผู้ใช้
  const register = async (data) => {
    try {
      setState((prevState) => ({ ...prevState, loading: true, error: null }));
      await axios.post(
        `${API_URL}/auth/register`,
        data
      );
      setState((prevState) => ({ ...prevState, loading: false, error: null }));
      navigate("/sign-up/success");
    } catch (error) {
      setState((prevState) => ({
        ...prevState,
        loading: false,
        error: error.response?.data?.error || "Registration failed",
      }));
      return { error: state.error };
    }
  };

  // ล็อกเอาท์ผู้ใช้
  const logout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setState({ user: null, error: null, loading: null });
    navigate("/");
  };
  // isauthenticated
  const isAuthenticated = Boolean(state.user);

  return (
    <AuthContext.Provider
      value={{
        state,
        login,
        logout,
        loginAdmin,
        register,
        isAuthenticated,
        fetchUser,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

// Hook สำหรับใช้งาน AuthContext
const useAuth = () => React.useContext(AuthContext);

export { AuthProvider, useAuth };