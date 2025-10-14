import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  LogOut,
  CircleArrowOutUpRight,
  RotateCw,
  UserPen,
} from "lucide-react";
import axios from "axios";
import NotificationBell from "./notification";


const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4001";

function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [login, setLogin] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLogin(false);
      return;
    }

    const fetchuser = async () => {
      try {
        const res = await axios.get(`${API_URL}/auth/get-user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setName(res.data.name);
        setImage(res.data.profilePic);
        setCurrentUserId(res.data.id);
        setLogin(true);
      } catch (e) {
        console.error("User fetch failed:", e);
        setLogin(false);
      }
    };

    fetchuser();
  }, []);

  function logout() {
    localStorage.removeItem("token");
    setLogin(false);
    window.location.reload();
  }

  const handleMobileClose = () => {
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 w-full h-[60px] flex flex-row justify-between items-center px-[60px] md:px-[120px] border-b-2 border-gray-200 bg-white z-50">
      <Link to={"/"}>
        <img src="/hh..png" alt="logo" className="hover:cursor-pointer" />
      </Link>

      {login ? (
        <div className="flex flex-row gap-[16px] justify-center items-center">
          {/* Notification Bell */}
          {currentUserId && (
            <NotificationBell
              currentUserId={currentUserId}
              onViewAll={() => navigate("/notifications")}
            />
          )}

          {/* User Profile Dropdown */}
          <div>
            <button
              className="flex flex-row gap-[12px] justify-center items-center hover:cursor-pointer"
              type="button"
              onClick={() => setDropdown(!dropdown)}
            >
              <img
                src={image || "/default-profile.jpg"}
                alt="image-profile"
                className="w-10 h-10 rounded-full object-cover border"
              />
              <p className="text-sm">{name}</p>
              <ChevronDown
                className={`transition-transform ${
                  dropdown ? "rotate-180" : ""
                }`}
              />
            </button>

            {dropdown && (
              <div className="absolute right-20 mt-2 w-[200px] bg-white rounded-md shadow-lg z-10 py-2 border">
                <Link
                  to="/profile"
                  state={{ category: "Profile" }}
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex flex-row gap-1"
                >
                  <UserPen />
                  <p>Profile</p>
                </Link>

                <Link
                  to="/profile"
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex flex-row gap-1 hover:cursor-pointer"
                  state={{ category: "Reset password" }}
                >
                  <RotateCw />
                  <p>Reset password</p>
                </Link>

                <Link
                  to={"/"}
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex flex-row gap-1 hover:cursor-pointer"
                >
                  <CircleArrowOutUpRight />
                  <p>Admin</p>
                </Link>

                <button
                  className="w-full text-left px-4 py-2 text-sm text-gray-500 flex flex-row gap-1 hover:bg-gray-100"
                  onClick={() => logout()}
                >
                  <LogOut />
                  <p>Logout</p>
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="gap-[8px] hidden md:flex">
            <Link to={"/login"}>
              <button
                type="button"
                className="w-[120px] h-[40px] bg-white border-2 border-gray-400 rounded-4xl flex justify-center items-center hover:cursor-pointer hover:bg-black hover:text-white"
              >
                Login
              </button>
            </Link>
            <Link to={"/SignUp"}>
              <button
                type="button"
                className="w-[120px] h-[40px] bg-black text-white rounded-4xl flex justify-center items-center hover:cursor-pointer hover:bg-white hover:border-2 hover:border-gray-400 hover:text-black"
              >
                Sign up
              </button>
            </Link>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
              className="flex flex-col justify-center items-center gap-1"
            >
              <span
                className={`block w-6 h-0.5 bg-black transition-transform ${
                  isOpen ? "rotate-45 translate-y-1.5" : ""
                }`}
              ></span>
              <span
                className={`block w-6 h-0.5 bg-black transition-opacity ${
                  isOpen ? "opacity-0" : "opacity-100"
                }`}
              ></span>
              <span
                className={`block w-6 h-0.5 bg-black transition-transform ${
                  isOpen ? "-rotate-45 -translate-y-1.5" : ""
                }`}
              ></span>
            </button>
          </div>

          {isOpen && (
            <div className="absolute top-[60px] left-0 w-full bg-white flex flex-col items-center gap-4 py-4 border-b-2 border-gray-200 md:hidden">
              <Link
                to={"/login"}
                onClick={handleMobileClose}
                className="w-[80%]"
              >
                <button className="w-full h-[40px] bg-white border-2 border-gray-400 rounded-4xl flex justify-center items-center hover:bg-black hover:text-white">
                  Login
                </button>
              </Link>
              <Link
                to={"/SignUp"}
                onClick={handleMobileClose}
                className="w-[80%]"
              >
                <button className="w-full h-[40px] bg-black text-white rounded-4xl flex justify-center items-center hover:bg-white hover:border-2 hover:border-gray-400 hover:text-black">
                  Sign up
                </button>
              </Link>
            </div>
          )}
        </>
      )}
    </nav>
  );
}

export default NavBar;