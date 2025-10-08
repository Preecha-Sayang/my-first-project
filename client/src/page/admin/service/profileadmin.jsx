import { useState, useEffect } from "react";
import axios from "axios";

function ProfileAdmin() {
  const [previewUrl, setPreviewUrl] = useState(null); // ลิงก์ preview รูปที่เลือก
  const [profilePic, setProfilePic] = useState("");
  const [selectedFile, setSelectedFile] = useState(null); // เก็บไฟล์ที่เลือก
  const [introbio, setIntrobio] = useState("");
  const [introname, setIntroname]=useState("")
  const [introusername, setIntrousername] =useState("")
  const [introemail, setIntroemail]= useState("")
   const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file)); // สร้าง preview URL
  };



  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await axios.get("http://localhost:4001/auth/get-user", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        
        const user = res.data;
        console.log("User data:",user); 
        setIntroname(user.name);
        setIntrousername(user.username);
        setIntroemail(user.email);
        setIntrobio(user.bio || "");
        setProfilePic(user.profilePic || "");
      } catch (error) {
        console.error("Failed to load user data", error);
      }
    }
    fetchUser();
  }, []);



  const handleSave = async () => {
    setLoading(true);

    try {
      let profilePicUrl = profilePic;

      if (selectedFile) {
        // อัพโหลดรูปก่อน
        const formData = new FormData();
        formData.append("profilePic", selectedFile);

        const uploadRes = await axios.post("http://localhost:4001/auth/upload-profile-pic", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        profilePicUrl = uploadRes.data.profilePicUrl;
        setProfilePic(profilePicUrl);
      }

      // อัพเดทข้อมูลโปรไฟล์
      const updateData = {
        name: introname,
        username: introusername,
        email: introemail,  // ถ้าต้องส่ง email ด้วย
        bio: introbio,
        profilePic: profilePicUrl, // ส่ง URL รูปโปรไฟล์ (ถ้า backend รองรับ)
      };

      const updateRes = await axios.put("http://localhost:4001/auth/update-profile", updateData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      alert("Profile updated successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };




  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="p-6 border-b flex justify-between items-center">
        <p className="text-xl font-semibold">Profile</p>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-all"
          onClick={handleSave}
          disabled={loading}
        >
          Save
        </button>
      </div>

      {/* Main Content */}
      <div className="flex flex-col gap-10 py-10 px-12">
        {/* Profile Picture Upload */}
        <div className="flex items-center gap-7">
          <img
            src={previewUrl || profilePic || "/default-profile.jpg"}
            alt="profile-logo"
            className="w-[120px] h-[120px] object-cover rounded-full border"
          />
          <div className="flex flex-col gap-2">
            <input
              type="file"
              accept="image/*"
              id="fileInput"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            <button
              onClick={() => document.getElementById("fileInput").click()}
              className="w-[255px] h-[50px] rounded-full flex justify-center items-center bg-gray-200 text-black 
              hover:cursor-pointer border"
            >
              Upload Profile Picture
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="border w-[480px]" />

        {/* Input */}
        <div className="flex flex-col gap-[30px]">
          <div className="flex flex-col gap-2">
            <label htmlFor="categorycreate" className="font-medium">
              Name
            </label>
            <input
              id="adminname"
              type="text"
              
              className="w-[480px] h-[50px] bg-white border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
              value={introname}
              onChange={(e)=> setIntroname(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="categorycreate" className="font-medium">
              Username
            </label>
            <input
              id="adminusername"
              type="text"
              className="w-[480px] h-[50px] bg-white border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
              value={introusername}
              onChange={(e)=> setIntrousername(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="categorycreate" className="font-medium">
              Email
            </label>
            <input
              id="adminemail"
              type="text"
              className="w-[480px] h-[50px] bg-white border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
              value={introemail}
              onChange={(e)=> setIntroemail(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio (max 120 letters)
            </label>
            <textarea
              value={introbio}
              onChange={(e) => {
                if (e.target.value.length <= 120) {
                  setIntrobio(e.target.value);
                }
              }}
              rows="6"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            <div className="text-xs text-gray-500 mt-1 text-right">
              {introbio.length}/120
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileAdmin;
