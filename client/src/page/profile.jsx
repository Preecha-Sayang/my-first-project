import NavBar from "@/component/narbar";
import ProfileCom from "@/component/forprofile/profilecom";
import { RotateCw, UserPen } from "lucide-react";
import { useEffect, useState } from "react";
import ResetPassword from "@/component/forprofile/forgetpassword";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";


function Profilepage() {
  const location = useLocation();
  const initialCategory = location.state?.category || "Profile";
  
  const [category , iscategory] = useState(initialCategory)
  const [name , isname] = useState("")
  const [picture, ispicture] = useState("")
  const navigate = useNavigate();
  

  async function fetchdata(){
    const token = localStorage.getItem("token");
  try{
    const result = await axios.get("http://localhost:4001/auth/get-user",{
      header:{
        Authorization: `Bearer ${token}`,
      }   
    })
    isname(result.data.name)
    ispicture(result.data.profilePic)
  }catch(e){
    console.log(e)
  }
  }
 
    useEffect(() => {
    // ตรวจสอบการเปลี่ยนแปลงของ location และอัปเดต category
    if (location.state?.category) {
      iscategory(location.state.category);
    }
  }, [location]);

  useEffect(()=>{
    const token = localStorage.getItem("token");
    if (!token) {
      // ถ้าไม่มี token ให้ไปหน้า login
      navigate("/login");
    } else {
      // มี token ให้เรียกฟังก์ชัน fetchdata
      fetchdata();
    }
  },[navigate])

  let render = null
  switch (category ) {
    case "Profile":
    render = <ProfileCom/>
    break;

    case "Reset password":
    render = <ResetPassword/>
    break;

    default:
      render = <div>Not Found</div>;
        break;
    }



  return (
    <div>
      <NavBar />
      <div className=" flex-grow ">
        <div className="flex flex-col items-center ">
          <div className="mt-[100px] w-[800px] mx-auto">
            <div className="flex flex-row items-center gap-[10px]">
              <img
                src={picture|| "/default-profile.jpg"}
                alt="logo"
                className="w-10 h-10 rounded-full object-cover border"
              />
              <p>
                {name} | <span> {category}</span>
              </p>
            </div>
            <div className="w-[800px]  flex flex-row justify-between items-between mt-[20px]">
              <div
                className="w-[200px] h-[100px]
                "
              >
                <div
                  className=" w-full h-[50px] flex flex-row 
                    py-[16px] px-[12px] gap-[10px] hover:cursor-pointer hover:bg-gray-300"
                onClick={()=> iscategory("Profile")}
                >
                  <UserPen />
                  <p>Profile</p>
                </div>
                <div
                  className=" w-full h-[50px] flex flex-row 
                    py-[16px] px-[12px] gap-[10px] hover:cursor-pointer hover:bg-gray-300"
                onClick={()=> iscategory("Reset password")}
                >
                  <RotateCw />
                  <p>Reset password</p>
                </div>
              </div>
              <div className="w-[550px] h-[650px]">
                {render}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profilepage;
