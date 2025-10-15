import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/authentication";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";

function ProtectedRoute({ requiredRole, children }) {
  const { state, isAuthenticated } = useAuth();
  const location = useLocation();
  const [redirect, setRedirect] = useState(false);

  // Loading User
  if (state.getUserLoading === null || state.getUserLoading) {
    return <div>กำลังโหลด...</div>;
  }

  // ยังไม่ Login
  if (!isAuthenticated) {
    Swal.fire({
      title: "กรุณาเข้าสู่ระบบ",
      icon: "warning",
      confirmButtonText: "ตกลง",
    }).then(() => {
      setRedirect(true);
    });
    return redirect ? (
      <Navigate to="/login" state={{ from: location }} replace />
    ) : null;
  }

  // ถูก Login แต่ Role ไม่ตรง
  if (requiredRole && state?.user?.role !== requiredRole) {
    Swal.fire({
      title: "คุณไม่มีสิทธิ์เข้าถึง",
      text: "หน้านี้สำหรับผู้ที่มีสิทธิ์เท่านั้น",
      icon: "error",
      confirmButtonText: "กลับหน้าหลัก",
    }).then(() => {
      setRedirect(true);
    });
    return redirect ? <Navigate to="/" replace /> : null;
  }

  return children;
}

export default ProtectedRoute;
