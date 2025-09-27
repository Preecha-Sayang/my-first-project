import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./page/HomePage";
import ViewPostPage from "./page/ViewPost";
import NotFoundPage from "./component/NofoundPage";
import { Toaster } from "@/components/ui/sonner";
import LoginPage from "./page/login";
import SignUp from "./page/signin";
import Profilepage from "./page/profile";




  
function App() {


  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
           <Route path="/post/:postId" element={<ViewPostPage/>} />
           <Route path="*" element={<NotFoundPage />} />
           <Route path="/login" element={<LoginPage/>}/>
           <Route path="/SignUp" element={<SignUp/>}/>
           <Route path="/profile" element={<Profilepage/>}/>
        </Routes>
      </Router>
      <Toaster
        toastOptions={{
          unstyled: true,
        }}
      />
    </div>

  )
}

export default App

  
