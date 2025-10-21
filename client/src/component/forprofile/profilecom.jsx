import { useState, useEffect } from "react";
import axios from "axios";


const API_URL = import.meta.env.VITE_API_URL ;
function ProfileCom() {
  const [names, setNames] = useState("");
  const [usernames, setUsernames] = useState("");
  const [emails, setEmails] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [loading, setLoading] = useState(true);

  const [selectedFile, setSelectedFile] = useState(null); // เก็บไฟล์ที่เลือก
  const [previewUrl, setPreviewUrl] = useState(null); // ลิงก์ preview รูปที่เลือก

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        // ถ้าไม่มี token ให้ไปหน้า login
        return;
      }

      try {
        const response = await axios.get(
          `${API_URL}/auth/get-user`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const { name, username, email, profilePic } = response.data;
        setNames(name);
        setUsernames(username);
        setEmails(email);
        setProfilePic(profilePic);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file)); // สร้าง preview URL
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first");
      return;
    }

    try {
      // ถ้ามีไฟล์รูป เลือกอัปโหลดก่อน
      if (selectedFile) {
        const formData = new FormData();
        formData.append("profilePic", selectedFile);

        await axios.post(`${API_URL}/auth/upload-profile-pic`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }

      // อัปเดตข้อมูล user เช่น name และ username (ถ้าคุณมี API อัปเดตข้อมูล user)
      await axios.put(
        `${API_URL}/auth/update-profile`, // สมมติ URL API อัปเดตข้อมูล
        {
          name: names,
          username: usernames,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Profile updated successfully");
    } catch (error) {
      console.error("Failed to save profile:", error);
      alert("Failed to save profile");
    }
  };

    if (loading) {
    return <div>Loading...</div>;
  }


  return (
    <div className="bg-gray-400 rounded-2xl p-[40px] flex flex-col gap-[40px]">
      <div className="flex flex-row  justify-center items-center gap-[28px]">
        <img
          src={previewUrl || profilePic || "/default-profile.jpg"}
          alt="profile-logo"
          className="w-[160px] h-[160px] object-cover rounded-full border"
        />
        <div className="flex flex-col gap-2">
          {/* ซ่อน input ไว้ แต่กดปุ่มเปิด dialog แทน */}
          <input
            type="file"
            accept="image/*"
            id="fileInput"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          <button
            onClick={() => document.getElementById("fileInput").click()}
            className="w-[255px] h-[50px] rounded-full flex justify-center items-center bg-black text-white hover:cursor-pointer"
          >
            Choose Profile Picture
          </button>
        </div>
      </div>



      <div className="w-full border-b  "></div>
      <div>
        <form className="flex flex-col gap-[28px]">
          <div className="flex flex-col gap-0.5">
            <label htmlFor="Name">Name</label>
            <input
              type="text"
              id="Name"
              value={names}
              onChange={(e) => setNames(e.target.value)}
              placeholder="test"
              className="h-[50px] bg-white p-4 rounded-xl"
            />
          </div>
          <div className="flex flex-col gap-0.5">
            <label htmlFor="Username">Username</label>
            <input
              type="text"
              id="Username"
              value={usernames}
              onChange={(e) => setUsernames(e.target.value)}
              placeholder="test"
              className="h-[50px] bg-white p-4 rounded-xl"
            />
          </div>
          <div className="flex flex-col gap-0.5">
            <label htmlFor="Email" className="bg-gray-400">
              Email
            </label>
            <input
              type="text"
              id="Email"
              value={emails}
              disabled
              placeholder="test"
              className="h-[50px] bg-gray-400 p-4 rounded-xl"
            />
          </div>
        </form>
      </div>
      <button
        className="flex justify-center items-center
            w-[120px] h-[50px] rounded-4xl bg-black text-white
            hover:cursor-pointer"
        type="summit"
        onClick={handleSave}
      >
        Save
      </button>
    </div>
  );
}

export default ProfileCom;
