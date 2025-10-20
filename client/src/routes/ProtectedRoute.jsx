import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/authentication";
import Swal from "sweetalert2";
import { useEffect, useRef } from "react";

function ProtectedRoute({ requiredRole, children }) {
  const { state, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const alertShownRef = useRef(false);

  // เรียก useEffect แบบไม่มีเงื่อนไข เพื่อไม่ให้ลำดับ Hooks เปลี่ยนขณะ render
  useEffect(() => {
    // ถ้ายังโหลด user อยู่ ให้เลิกทำอะไรเพิ่มเติมใน effect
    if (state.getUserLoading === null || state.getUserLoading) return;
    if (alertShownRef.current) return;

    // ยังไม่ Login → show alert แล้ว navigate ไป /login
    if (!isAuthenticated) {
      alertShownRef.current = true;
      Swal.fire({
        title: "กรุณาเข้าสู่ระบบ",
        icon: "warning",
        confirmButtonText: "ตกลง",
      }).then(() => {
        navigate("/login", { state: { from: location }, replace: true });
      });
      return;
    }

    // ถูก Login แต่ Role ไม่ตรง → show alert แล้ว navigate ไปหน้าแรก
    if (requiredRole && state?.user?.role !== requiredRole) {
      alertShownRef.current = true;
      Swal.fire({
        title: "คุณไม่มีสิทธิ์เข้าถึง",
        text: "หน้านี้สำหรับผู้ที่มีสิทธิ์เท่านั้น",
        icon: "error",
        confirmButtonText: "กลับหน้าหลัก",
      }).then(() => {
        navigate("/", { replace: true });
      });
    }
  }, [
    isAuthenticated,
    requiredRole,
    state?.user?.role,
    state.getUserLoading,
    navigate,
    location,
  ]);

  // แสดง loading จนกว่า fetchUser จะเสร็จ เพื่อไม่ให้แสดงเนื้อหาหรือ redirect ก่อนเวลา
  if (state.getUserLoading === null || state.getUserLoading) {
    return <div>กำลังโหลด...</div>;
  }

  // ในระหว่างที่รอผลจาก useEffect ให้ไม่แสดงเนื้อหา
  if (!isAuthenticated) return null;
  if (requiredRole && state?.user?.role !== requiredRole) return null;

  return children;
}

export default ProtectedRoute;
