import NavBar from "@/component/narbar";
import ProfileCom from "@/component/profilecom";
import { RotateCw, UserPen } from "lucide-react";

function Profilepage() {
  const name = "preehca";
  const image = "/herosection.png";
  return (
    <div>
      <NavBar />
      <div className=" flex-grow">
        <div className="flex flex-col items-center">
          <div className="mt-[100px]">
            <div className="flex flex-row items-center gap-[10px]">
              <img
                src={image}
                alt="logo"
                className="w-10 h-10 rounded-full object-cover"
              />
              <p>
                {name} | <span> Profie</span>
              </p>
            </div>
            <div className="w=[800px] h-600px flex flex-row justify-between items-between mt-[20px]">
              <div
                className="w-[200px] h-[100px]
                "
              >
                <div
                  className=" w-full h-[50px] flex flex-row 
                    py-[16px] px-[12px] gap-[10px] hover:cursor-pointer hover:bg-gray-300"
                >
                  <UserPen />
                  <p>Profile</p>
                </div>
                <div
                  className=" w-full h-[50px] flex flex-row 
                    py-[16px] px-[12px] gap-[10px] hover:cursor-pointer hover:bg-gray-300"
                >
                  <RotateCw />
                  <p>Reset password</p>
                </div>
              </div>
              <div className="w-[550px] h-[650px]">
                <ProfileCom/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profilepage;
