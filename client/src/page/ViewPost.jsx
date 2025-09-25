
import Footer from "@/component/Footer";
import NarBar from "@/component/narbar";
import ViewPost from "@/component/View-Post-com";


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