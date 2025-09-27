
import AdminLoginPage from "@/component/login/login";
import NavBar from "../component/narbar";



export default function LoginPage() {


  return (
    <div className="flex flex-col min-h-screen">
       <NavBar />
      <div className="flex-grow">
        <AdminLoginPage/>
      </div>
    </div>
  );
}