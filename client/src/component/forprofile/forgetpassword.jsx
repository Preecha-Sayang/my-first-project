import { useState } from "react";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4001";

function ResetPassword() {
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
        `${API_URL}/auth/reset-password`,
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
    <div className="bg-gray-400 rounded-2xl p-[40px] flex flex-col gap-[40px]">
      <form className="flex flex-col gap-[28px]">
        <div className="flex flex-col gap-0.5">
          <label htmlFor="password-current">Current password</label>
          <input
            type="password"
            id="password-current"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder="Current password"
            className="h-[50px] bg-white p-4 rounded-xl"
          />
        </div>

        <div className="flex flex-col gap-0.5">
          <label htmlFor="new-password">New password</label>
          <input
            type="password"
            id="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New password"
            className="h-[50px] bg-white p-4 rounded-xl"
          />
        </div>

        <div className="flex flex-col gap-0.5">
          <label htmlFor="confirm-password">Confirm new password</label>
          <input
            type="password"
            id="confirm-password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            placeholder="Confirm new password"
            className="h-[50px] bg-white p-4 rounded-xl"
          />
        </div>
      </form>

      <button
        className="flex justify-center items-center
          w-[200px] h-[50px] rounded-4xl bg-black text-white
          hover:cursor-pointer disabled:opacity-50"
        type="button"
        onClick={handleResetPassword}
        disabled={loading}
      >
        {loading ? "Processing..." : "Reset Password"}
      </button>
    </div>
  );
}

export default ResetPassword;