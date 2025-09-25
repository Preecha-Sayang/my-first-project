import Footer from "@/component/Footer";
import NarBar from "@/component/narbar";
import NotFoundPage from "@/component/NofoundPage";



export default function ViewPostPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <NarBar />
      <div className="flex-grow">
        <NotFoundPage/>
      </div>
      <Footer />
    </div>
  );
}