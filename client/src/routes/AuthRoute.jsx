// src/routes/AuthRoute.jsx
import { Navigate } from "react-router-dom";


import { useAuth } from "@/context/authentication";
import LoadingScreen from "@/component/LoadingScreen";

function AuthRoute({ children }) {
  const { isAuthenticated, state } = useAuth();

  // ตรวจสอบสถานะ Loading จาก Context
  const isLoading = state.getUserLoading || state.loading;

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="min-h-screen md:p-8">
          <LoadingScreen />
        </div>
      </div>
    );
  }

  // ถ้าล็อกอินแล้ว → ไม่ให้เข้า Login/Register → ส่งกลับหน้า Home
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // ถ้ายังไม่ Login → ให้เข้าได้
  return children;
}

export default AuthRoute;