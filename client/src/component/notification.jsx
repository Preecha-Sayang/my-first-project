import { useState, useEffect, useRef } from "react";
import { Bell, Trash2, Eye } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// ฟังก์ชันสร้าง Supabase client ที่มี token
const getAuthedSupabase = () => {
  const token = localStorage.getItem("token");
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });
};

function NotificationBell({ currentUserId, onViewAll }) {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // โหลดการแจ้งเตือน
  useEffect(() => {
    if (!currentUserId) return;

    const fetchNotifications = async () => {
      const supabase = getAuthedSupabase();

      const { data, error } = await supabase
        .from("notifications")
        .select("*")
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

  // Subscribe realtime
  useEffect(() => {
    if (!currentUserId) return;

    const supabase = getAuthedSupabase();

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

          if (event === "INSERT") {
            setNotifications((prev) => [newData, ...prev.slice(0, 4)]);
          }

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

          if (event === "DELETE") {
            setNotifications((prev) =>
              prev.filter((n) => n.id !== oldData.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserId]);

  // ปิด dropdown เมื่อคลิกนอก
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

  // ฟังก์ชัน mark as read
  const markAsRead = async (id) => {
    const supabase = getAuthedSupabase();

    await supabase.from("notifications").update({ is_read: true }).eq("id", id);

    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
  };

  // ฟังก์ชันลบการแจ้งเตือน
  const deleteNotification = async (id) => {
    const supabase = getAuthedSupabase();

    await supabase
      .from("notifications")
      .update({ is_deleted: true })
      .eq("id", id);

    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // ฟังก์ชัน format เวลา
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "เมื่อสักครู่";
    if (minutes < 60) return `${minutes} นาทีที่แล้ว`;
    if (hours < 24) return `${hours} ชั่วโมงที่แล้ว`;
    return `${days} วันที่แล้ว`;
  };

  // นับจำนวน unread
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="relative w-10 h-10 rounded-full flex justify-center items-center bg-gray-100 hover:bg-gray-200 transition-colors"
        aria-label="Notifications"
        type="button"
        onClick={() => setShowDropdown(!showDropdown)}
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
          <div className="sticky top-0 bg-white border-b px-4 py-3 flex justify-between items-center">
            <h3 className="font-semibold text-gray-800">การแจ้งเตือน</h3>
            <button
              onClick={() => {
                setShowDropdown(false);
                if (onViewAll) onViewAll();
              }}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              ดูทั้งหมด
            </button>
          </div>

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
                  className={`px-4 py-3 hover:bg-gray-50 transition-colors ${
                    !notif.is_read ? "bg-blue-50" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
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

                    <div className="flex gap-1 flex-shrink-0">
                      {!notif.is_read && (
                        <button
                          onClick={() => markAsRead(notif.id)}
                          className="p-1.5 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                          title="ทำเครื่องหมายว่าอ่านแล้ว"
                        >
                          <Eye size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notif.id)}
                        className="p-1.5 text-red-600 hover:bg-red-100 rounded transition-colors"
                        title="ลบการแจ้งเตือน"
                      >
                        <Trash2 size={16} />
                      </button>
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