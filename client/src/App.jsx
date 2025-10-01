import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./page/HomePage";
import ViewPostPage from "./page/ViewPost";
import NotFoundPage from "./component/NofoundPage";
import { Toaster } from "@/components/ui/sonner";
import LoginPage from "./page/login";
import SignUp from "./page/signin";
import Profilepage from "./page/profile";
import LoginAdmin from "./page/admin/loginadmin";
import AdminService from "./page/admin/service";






  
function App() {


  return (
    <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
           <Route path="/post/:postId" element={<ViewPostPage/>} />
           <Route path="*" element={<NotFoundPage />} />
           <Route path="/login" element={<LoginPage/>}/>
           <Route path="/SignUp" element={<SignUp/>}/>
           <Route path="/profile" element={<Profilepage/>}/>
           <Route path="/admin/login" element={<LoginAdmin/>}/>
           <Route path="/admin/service" element={<AdminService/>}/>
        </Routes>
      <Toaster
        toastOptions={{
          unstyled: true,
        }}
      />
    </div>

  )
}

export default App

  
