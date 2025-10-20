
import LoginPage from "@/component/login/login";
import NavBar from "../component/narbar";



export default function UserLoginPage() {


  return (
    <div className="flex flex-col min-h-screen">
       <NavBar />
      <div className="flex-grow">
        <LoginPage/>
      </div>
    </div>
  );
}