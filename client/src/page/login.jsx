
import AdminLoginPage from "@/component/after-login/login";
import NarBar from "@/component/narbar";



export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <NarBar />
      <div className="flex-grow">
        <AdminLoginPage/>
      </div>
    </div>
  );
}