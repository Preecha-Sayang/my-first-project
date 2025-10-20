

import Footer from "@/component/footer.jsx";
import NarBar from "@/component/narbar.jsx";
import ViewPost from "@/component/View-Post-com.jsx";


export default function ViewPostPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <NarBar />
      <div className="flex-grow">
        <ViewPost/>
      </div>
      <Footer />
    </div>
  );
}