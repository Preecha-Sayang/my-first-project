import { useState, useEffect } from "react";
import axios from "axios";
function ProfileCom() {
  const [names, setNames] = useState("");
  const [usernames, setUsernames] = useState("");
  const [emails, setEmails] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        // ถ้าไม่มี token ให้ไปหน้า login
        return;
      }

      try {
        const response = await axios.get("http://localhost:4001/auth/get-user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

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

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-gray-400 rounded-2xl p-[40px] flex flex-col gap-[40px]">
      <div className="flex flex-row  justify-center items-center gap-[28px]">
        <img
          src={profilePic|| "/hh..png"}
          alt="profile-logo"
          className="w-[160px] h-[160px] object-cover rounded-full"
        />
        <button
          className="w-[255px] h-[50px] rounded-full flex justify-center items-center bg-black
        text-white hover:cursor-pointer"
        >
          Upload Profile Picture
        </button>
      </div>
      <div className="w-full border-b  "></div>
      <div >
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
            <label htmlFor="Email" className="bg-gray-400">Email</label>
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
      >
        Save
      </button>
    </div>
  );
}

export default ProfileCom;
