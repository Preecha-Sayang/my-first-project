import { useState, useEffect } from "react";
import axios from "axios";
import { supabase } from "@/supabaseClient";
import { Bell, Trash2, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4001";

function NotificationPage() {
  const [notifications, setNotifications] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState("user");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const notificationsPerPage = 6;
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // โหลด User
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_URL}/auth/get-user`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const user = res.data;
        if (user) {
          setCurrentUser(user);
          const { data: userData, error } = await supabase
            .from("users")
            .select("role, username, name, profile_pic")
            .eq("id", user.id)
            .single();
          if (!error && userData) {
            setUserRole(userData.role || "user");
            setUsername(userData.username || "");
            setName(userData.name || "");
            setProfilePic(userData.profile_pic || "");
          }
        }
      } catch (error) {
        console.error("loadUser error:", error);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  // โหลดแจ้งเตือน
  useEffect(() => {
    if (!currentUser) return;
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
        .eq("user_id", currentUser.id)
        .eq("is_deleted", false)
        .order("created_at", { ascending: false });
      if (!error) setNotifications(data || []);
    };
    fetchNotifications();
  }, [currentUser]);

  // Real-Time
  useEffect(() => {
    if (!currentUser) return;
    const channel = supabase
      .channel(`notifications:${currentUser.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${currentUser.id}`,
        },
        (payload) => {
          const { event, new: newData, old: oldData } = payload;
          if (event === "INSERT") {
            setNotifications((prev) => [newData, ...prev]);
            setPage(1);
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
            setNotifications((prev) => prev.filter((n) => n.id !== oldData.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser]);

  // เปิดแจ้งเตือน + ไปหน้าโพสต์
  const handleOpenNotification = async (notif) => {
    if (!notif.is_read) {
      await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", notif.id);
    }
    if (notif.post_id) {
      navigate(`/post/${notif.post_id}`);
    }
  };

  // ลบ
  const deleteNotification = async (id) => {
    const { error } = await supabase
      .from("notifications")
      .update({ is_deleted: true })
      .eq("id", id);
    if (!error) {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }
  };

  // ทำเครื่องหมายอ่านทั้งหมด
  const markAllAsRead = async () => {
    const unreadIds = notifications.filter((n) => !n.is_read).map((n) => n.id);
    if (unreadIds.length === 0) return;
    await supabase
      .from("notifications")
      .update({ is_read: true })
      .in("id", unreadIds);
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  // ลบที่อ่านแล้ว
  const deleteAllRead = async () => {
    const readIds = notifications.filter((n) => n.is_read).map((n) => n.id);
    if (readIds.length === 0) return;
    await supabase
      .from("notifications")
      .update({ is_deleted: true })
      .in("id", readIds);
    setNotifications((prev) => prev.filter((n) => !n.is_read));
  };

  // Filter + Pagination
  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.is_read;
    if (filter === "read") return n.is_read;
    return true;
  });

  const indexOfLastNotif = page * notificationsPerPage;
  const indexOfFirstNotif = indexOfLastNotif - notificationsPerPage;
  const currentNotifications = filteredNotifications.slice(
    indexOfFirstNotif,
    indexOfLastNotif
  );
  const totalPages = Math.ceil(
    filteredNotifications.length / notificationsPerPage
  );

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

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Bell
            size={48}
            className="mx-auto mb-4 text-gray-300 animate-pulse"
          />
          <p className="text-gray-500">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              {profilePic && (
                <img
                  src={profilePic}
                  alt="Avatar"
                  className="w-10 h-10 rounded-full object-cover"
                />
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <Bell size={28} />
                  การแจ้งเตือน
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  สวัสดี, {name || username} • Role:{" "}
                  {userRole === "admin" ? "👑 Admin" : "👤 User"} •{" "}
                  {unreadCount > 0
                    ? `${unreadCount} ข้อความใหม่`
                    : "ไม่มีข้อความใหม่"}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Check size={18} />
                  อ่านทั้งหมด
                </button>
              )}
              {notifications.filter((n) => n.is_read).length > 0 && (
                <button
                  onClick={deleteAllRead}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  <Trash2 size={18} />
                  ลบที่อ่านแล้ว
                </button>
              )}
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 border-b">
            <button
              onClick={() => {
                setFilter("all");
                setPage(1);
              }}
              className={`px-4 py-2 border-b-2 transition-colors ${
                filter === "all"
                  ? "border-blue-500 text-blue-600 font-semibold"
                  : "border-transparent text-gray-600 hover:text-gray-800"
              }`}
            >
              ทั้งหมด ({notifications.length})
            </button>
            <button
              onClick={() => {
                setFilter("unread");
                setPage(1);
              }}
              className={`px-4 py-2 border-b-2 transition-colors ${
                filter === "unread"
                  ? "border-blue-500 text-blue-600 font-semibold"
                  : "border-transparent text-gray-600 hover:text-gray-800"
              }`}
            >
              ยังไม่อ่าน ({unreadCount})
            </button>
            <button
              onClick={() => {
                setFilter("read");
                setPage(1);
              }}
              className={`px-4 py-2 border-b-2 transition-colors ${
                filter === "read"
                  ? "border-blue-500 text-blue-600 font-semibold"
                  : "border-transparent text-gray-600 hover:text-gray-800"
              }`}
            >
              อ่านแล้ว ({notifications.filter((n) => n.is_read).length})
            </button>
          </div>
        </div>
      </div>

      {/* Notification List */}
      <div className="max-w-6xl mx-auto p-6">
        {currentNotifications.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Bell size={64} className="mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {filter === "unread"
                ? "ไม่มีการแจ้งเตือนใหม่"
                : filter === "read"
                ? "ไม่มีการแจ้งเตือนที่อ่านแล้ว"
                : "ไม่มีการแจ้งเตือน"}
            </h3>
            <p className="text-gray-500">
              {filter === "unread"
                ? "คุณอ่านการแจ้งเตือนทั้งหมดแล้ว"
                : filter === "read"
                ? "ยังไม่มีการแจ้งเตือนที่อ่านแล้ว"
                : "เมื่อมีกิจกรรมใหม่ คุณจะเห็นการแจ้งเตือนที่นี่"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {currentNotifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleOpenNotification(notif)}
                className={`cursor-pointer bg-white rounded-lg shadow-sm p-5 transition-all hover:shadow-md ${
                  !notif.is_read ? "border-l-4 border-l-blue-500" : ""
                }`}
              >
                <div className="flex justify-between items-start gap-4">
                  <img
                    src={notif.actor?.profile_pic || "/default-avatar.png"}
                    alt={notif.actor?.username}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-800 text-lg">
                        {notif.title}
                      </h3>
                      {!notif.is_read && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-2">{notif.message}</p>
                    <p className="text-xs text-gray-400">
                      {formatTime(notif.created_at)}
                    </p>
                  </div>

                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notif.id);
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="ลบการแจ้งเตือน"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
              className="px-4 py-2 bg-white border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              ก่อนหน้า
            </button>

            <div className="flex gap-1">
              {[...Array(totalPages)].map((_, idx) => {
                const pageNum = idx + 1;
                return (
                  <button
                    key={`page-${pageNum}`}
                    onClick={() => setPage(pageNum)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      page === pageNum
                        ? "bg-blue-500 text-white"
                        : "bg-white border hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((prev) => prev + 1)}
              className="px-4 py-2 bg-white border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              ถัดไป
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default NotificationPage;
