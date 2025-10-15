import { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import { supabase } from "@/supabaseClient";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

function NotificationBell({ currentUserId }) {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Load Notifications
  useEffect(() => {
    if (!currentUserId) return;

    const fetchNotifications = async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select(
          `
          id, user_id, type, title, message, post_id, is_read, created_at,
          actor:actor_id (
            username,
            profile_pic
          )
        `
        )
        .eq("user_id", currentUserId)
        .eq("is_deleted", false)
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) {
        console.error("โหลดการแจ้งเตือนผิดพลาด:", error);
        return;
      }

      setNotifications(data || []);
    };

    fetchNotifications();
  }, [currentUserId]);

  // Realtime Subscribe
  useEffect(() => {
    if (!currentUserId) return;

    const channel = supabase
      .channel(`notifications:${currentUserId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${currentUserId}`,
        },
        (payload) => {
          const { event, new: newData, old: oldData } = payload;

          // INSERT Notification
          if (event === "INSERT") {
            setNotifications((prev) => [newData, ...prev.slice(0, 4)]);
          }

          // UPDATE Notification
          if (event === "UPDATE") {
            if (newData.is_deleted) {
              setNotifications((prev) =>
                prev.filter((n) => n.id !== newData.id)
              );
            } else {
              setNotifications((prev) =>
                prev.map((n) => (n.id === newData.id ? newData : n))
              );
            }
          }

          // DELETE Notification
          if (event === "DELETE") {
            setNotifications((prev) => prev.filter((n) => n.id !== oldData.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserId]);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  // Mark single notification as Read
  const markAsRead = async (id) => {
    await supabase.from("notifications").update({ is_read: true }).eq("id", id);

    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
  };

  // Delete Notification
  const deleteNotification = async (id) => {
    await supabase
      .from("notifications")
      .update({ is_deleted: true })
      .eq("id", id);

    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Navigate to post
  const handleNavigate = async (notif) => {
    if (!notif.post_id) return;

    await markAsRead(notif.id);
    navigate(`/post/${notif.post_id}`);
    setShowDropdown(false);
  };

  // Format time
  dayjs.extend(utc);
  dayjs.extend(timezone);

  const formatTime = (timestamp) => {
    const date = dayjs.utc(timestamp).tz("Asia/Bangkok");
    const now = dayjs().tz("Asia/Bangkok");
    const diffMinutes = now.diff(date, "minute");
    const diffHours = now.diff(date, "hour");
    const diffDays = now.diff(date, "day");

    if (diffMinutes < 1) return "เมื่อสักครู่";
    if (diffMinutes < 60) return `${diffMinutes} นาทีที่แล้ว`;
    if (diffHours < 24) return `${diffHours} ชั่วโมงที่แล้ว`;
    return `${diffDays} วันที่แล้ว`;
  };

  // Count unread notifications
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const markAllAsRead = async () => {
    if (notifications.length === 0) return;

    await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", currentUserId);

    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="relative w-10 h-10 rounded-full flex justify-center items-center bg-gray-100 hover:bg-gray-200 transition-colors"
        aria-label="Notifications"
        type="button"
        onClick={() => {
          setShowDropdown(!showDropdown);
          if (!showDropdown) {
            markAllAsRead();
          }
        }}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <div className="absolute top-0 right-0 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          </div>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-3 w-[380px] bg-white rounded-lg shadow-xl z-50 border max-h-[500px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="px-4 py-8 text-center text-gray-500">
              <Bell size={48} className="mx-auto mb-2 text-gray-300" />
              <p>ไม่มีการแจ้งเตือน</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer ${
                    !notif.is_read ? "bg-blue-50" : ""
                  }`}
                  onClick={() => handleNavigate(notif)}
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={notif.actor?.profile_pic || "/default-avatar.png"}
                      alt={notif.actor?.username}
                      className="w-10 h-10 rounded-full object-cover"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-gray-800 text-sm">
                          {notif.title}
                        </p>
                        {!notif.is_read && (
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-1 line-clamp-2">
                        {notif.message}
                      </p>
                      <span className="text-xs text-gray-400">
                        {formatTime(notif.created_at)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
