import NavBar from "@/component/narbar";
import ProfileCom from "@/component/forprofile/profilecom";
import { RotateCw, UserPen } from "lucide-react";
import { useState } from "react";
import ResetPassword from "@/component/forprofile/forgetpassword";


function Profilepage() {
  const [category , iscategory] = useState("Profile")
  const name = "preehca";
  const image = "/herosection.png";


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
                src={image}
                alt="logo"
                className="w-10 h-10 rounded-full object-cover"
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
