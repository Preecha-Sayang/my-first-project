import { useState } from 'react'
import NarBar from '@/component/narbar';
import Herosection from '@/component/herosection';
import Search from '@/component/search';
import BlogCard from '@/component/ArticleSection';
import Footer from '@/component/footer';



function HomePage() {

    const [category, setCategory] = useState("Highlight");
    const [keyword, setKeyword] = useState("");

  return (
    <div className="flex flex-col">
    <NarBar/>
    <Herosection/> 
    <Search category={category} setCategory={setCategory} keyword={keyword} setKeyword={setKeyword} />
    <BlogCard category={category} keyword={keyword} />
    <Footer/>
    </div>

  )
}

export default HomePage