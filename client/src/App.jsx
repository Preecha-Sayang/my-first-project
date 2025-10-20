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
import AuthRoute from "./routes/AuthRoute";
import ProtectedRoute from "./routes/ProtectedRoute";






  
function App() {


  return (
    <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />

           <Route path="/post/:postId" element={<ViewPostPage/>} />

           <Route path="*" element={<NotFoundPage />} />

           <Route path="/login" element={
            <AuthRoute>
              <LoginPage/>              
            </AuthRoute>
            }/>

           <Route path="/SignUp" element={
            <AuthRoute>
                <SignUp/>
            </AuthRoute>
          }/>
           <Route path="/profile" element={
            <ProtectedRoute>
              <Profilepage/>
            </ProtectedRoute>
            }/>

           <Route path="/admin/login" element={
            <AuthRoute>
              <LoginAdmin/>
            </AuthRoute>
          }/>

           <Route path="/admin/service" element={
            <ProtectedRoute requiredRole="admin">
             <AdminService/>
            </ProtectedRoute>
          }/>

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

  
