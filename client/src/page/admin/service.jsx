import { useState } from "react";
import ArticleManagement from "./service/article";
import CreateArticle from "./service/createarticle";
import EditArticle from "./service/EditArticle";
import CategoriesManage from "./service/category";
import CreateCatrgory from "./service/categorycreate";
import ProfileAdmin from "./service/profileadmin";
import AdminResetPassword from "./service/adminresetpassword";
import NotificationRealtime from "./service/noctification";
import { useAuth } from "@/context/authentication";
import { Link } from "react-router-dom";

const menuitem = [
  { label: "Article management", img: "/contain/notebook_light.svg" },
  { label: "Category management", img: "/contain/File_light.svg" },
  { label: "Profile", img: "/contain/User_duotone.svg" },
  { label: "Notification", img: "/contain/Bell_light.svg" },
  { label: "Reset password", img: "/contain/Bell_light.svg" },
];

function AdminService() {
  const [category, setCategory] = useState("Article management");
  const [isCreatingArticle, setIsCreatingArticle] = useState(false);
  const [editingPostId, setEditingPostId] = useState(false);
  const [Category, setisCategories] = useState(false);

    const {logout } = useAuth();


  const renderContent = () => {
    if (isCreatingArticle) {
      return <CreateArticle onCancel={() => setIsCreatingArticle(false)} />;
    }

    if (editingPostId) {
      return (<EditArticle postId={editingPostId} onCancel={() => setEditingPostId(false)}/>
      );
    }

    if (Category) {
      return <CreateCatrgory onCancel={() => setisCategories(false)} />;
    }

    switch (category) {
      case "Article management":
        return <ArticleManagement setIsCreatingArticle={setIsCreatingArticle} setEditingPostId={setEditingPostId}/>
      case "Category management":
        return <CategoriesManage setisCategories={setisCategories} />;
      case "Profile":
        return <ProfileAdmin/>;
      case "Notification":
        return <NotificationRealtime/>;
      case "Reset password":
        return <AdminResetPassword/>;
      default:
        return <p>ไม่มีหน้าที่ต้องการ</p>;
    }
  };


    async function handleLogout() {
    logout();
    navigate("/");
  }



  return (
    <div className="flex flex-row">
      {/* Sidebar */}
      <div className="w-[280px] h-screen bg-amber-200 shadow-lg flex flex-col justify-between">
        {/* Logo Section */}
        <div>
          <div className="h-[200px] flex flex-col justify-center items-center p-5 gap-4">
            <img src="/hh..png" alt="logo" />
            <img src="/contain/Text.svg" alt="admin_panel" />
          </div>

          {/* Menu Items */}
          <div className="flex flex-col gap-1 px-2">
            {menuitem.map((item, index) => {
              const isActive = category === item.label;
              return (
                <div
                  key={index}
                  onClick={() => {
                    setCategory(item.label);
                    setIsCreatingArticle(false); // ✅ กลับจากหน้า create
                    setEditingPostId(false);
                    setisCategories(false)
                  }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-md cursor-pointer transition-all 
                    ${
                      isActive
                        ? "bg-amber-300 font-semibold"
                        : "hover:bg-amber-300"
                    }`}
                >
                  <img src={item.img} alt={item.label} className="w-6 h-6" />
                  <p className="text-sm text-gray-800">{item.label}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Section */}
        <div className="px-4 py-4">
          <div className="flex items-center gap-3 mb-3 cursor-pointer hover:opacity-80">
            <img
              src="/contain/Out_light.svg"
              alt="Out_light"
              className="w-5 h-5"
            />
            <Link to={`/`}>
            <p className="text-sm font-medium text-gray-800">hh. website</p>
            </Link>
          </div>
          <div className="border-b border-gray-400 mb-3"></div>
          <div className="flex items-center gap-3 cursor-pointer hover:opacity-80"
          onClick={handleLogout}
          >
            <img src="/contain/logout.svg" alt="logout" className="w-5 h-5" />
            <p className="text-sm font-medium text-red-600">Log out</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">{renderContent()}</div>
    </div>
  );
}

export default AdminService;
