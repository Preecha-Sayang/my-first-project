
import SignupForm from "@/component/after-login/signin";
import NarBar from "@/component/narbar";



export default function SignUp() {
  return (
    <div className="flex flex-col min-h-screen">
      <NarBar />
      <div className="flex-grow">
        <SignupForm/>
      </div>
    </div>
  );
}