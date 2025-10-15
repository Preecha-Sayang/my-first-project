import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4001";

function Herosection(){
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const response = await axios.get(`${API_URL}/posts/admin/profile`);
        setAdmin(response.data.profile);
      } catch (error) {
        console.error("Error fetching admin:", error);
      }
    };

    fetchAdmin();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center w-[100%] my-[120px] px-4">
      <div className="flex flex-col md:flex-row items-center justify-center gap-[40px] w-full md:w-[80%]">
        
        {/* RIGHT */}
        <div className="w-full md:w-1/3 text-center md:text-right flex flex-col gap-4">
          <h1 className="text-3xl md:text-4xl font-bold">Stay Informed, Stay Inspired</h1>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed">
            Discover a World of Knowledge at Your Fingertips. Your Daily Dose of Inspiration and Information.
          </p>
        </div>

        {/* IMAGE */}
        <img
          src={admin?.profile_pic || "./default-profile.jpg"}
          alt="admin"
          className="w-[90%] h-[500px] md:w-1/3 md:h-[530px] object-contain"
        />

        {/* LEFT */}
        <div className="w-full md:w-1/3 flex flex-col gap-4 text-left">
          <div>
            <p className="text-gray-500">-Author</p>
            <h4 className="font-semibold text-lg">{admin?.name || "ไม่มีข้อมูล"}</h4>
          </div>
          <div className="max-w-[400px] mx-auto md:mx-0">
            <p className="text-sm md:text-base leading-relaxed">
              {admin?.bio || "ไม่มีข้อมูล"}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Herosection;
