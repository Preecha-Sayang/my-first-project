import { useState } from "react";
import axios from "axios";

function AdminResetPassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      alert("New password and confirm password do not match");
      return;
    }

    if (!oldPassword || !newPassword || !confirmNewPassword) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.put(
        "http://localhost:4001/auth/reset-password",
        {
          oldPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Password updated successfully");
      setOldPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (error) {
      console.error("Failed to reset password:", error);
      alert(
        error.response?.data?.error ||
          "Failed to reset password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="p-6 border-b flex justify-between items-center">
        <p className="text-xl font-semibold">Reset Password</p>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-all"
          onClick={handleResetPassword}
          disabled={loading}
        >
          Reset Password
        </button>
      </div>
      <div className="rounded-2xl p-[40px] flex flex-col gap-[40px]">
        <form className="flex flex-col gap-[28px]">
          <div className="flex flex-col gap-0.5 w-[480px]">
            <label htmlFor="password-current">Current password</label>
            <input
              type="password"
              id="password-current"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Current password"
              className="h-[50px] bg-white p-4 rounded-xl border"
            />
          </div>

          <div className="flex flex-col gap-0.5 w-[480px]">
            <label htmlFor="new-password">New password</label>
            <input
              type="password"
              id="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New password"
              className="h-[50px] bg-white p-4 rounded-xl border"
            />
          </div>

          <div className="flex flex-col gap-0.5 w-[480px]">
            <label htmlFor="confirm-password">Confirm new password</label>
            <input
              type="password"
              id="confirm-password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              placeholder="Confirm new password"
              className="h-[50px] bg-white p-4 rounded-xl border"
            />
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminResetPassword;
