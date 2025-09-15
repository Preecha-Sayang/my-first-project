/* eslint-disable react/prop-types */
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";

export default function ViewPost() {
     const { postId } = useParams();
     const [post, setPost] = useState(null);
    async function fetchdata () {
        try {const result = await axios.get(`https://blog-post-project-api.vercel.app/posts/${postId}`)
            setPost(result.data)
         }catch(e){
            console.error(e)
        }
    }
      useEffect(()=>{
        fetchdata()
    },[])
    if (!post) return <p>Loading...</p>;

      return (
    <div className="flex flex-col justify-center items-center">
        <img src={post.image} alt={post.title} className="w-[80%] h-[600px] object-cover mt-[100px] rounded-3xl overflow-hidden" />

        <div id="content" className="flex flex-row  justify-between items-center mt-[30px]">

            <div id="left" className="w-[900px] flex flex-col ">
            <p>
                <span className="text-sm font-medium text-white bg-indigo-500 px-3 py-1 rounded-full w-fit">
                {post.category}</span> | {new Date(post.date).toLocaleDateString()}
            </p>
            <h1 className="!text-3xl mt-[20px]">{post.title}</h1>
            <div className="markdown">
                <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>
            </div>

            <div id="right" className="w-[300px] h-[400px] bg-amber-300">
            <p>detail</p>
            </div>
        </div>
    </div>
  );
    
  
}

