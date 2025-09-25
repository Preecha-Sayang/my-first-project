/* eslint-disable react/prop-types */
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { TextareaDemo } from "./textxara";
import { Linkedin, Twitter, Instagram, SmilePlus, Copy, X } from 'lucide-react';
import { comments } from "@/data/comment";
import { toast } from "sonner";


export default function ViewPost() {
   
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const shareLink = window.location.href;
    const [error, setError] = useState(null);

    async function fetchdata () {
        try {const result = await axios.get(`https://blog-post-project-api.vercel.app/posts/${postId}`)
            setPost(result.data)
              setError(null);
         }catch(e){
            console.error(e)
            
        }
    }
      useEffect(()=>{
        fetchdata()
    },[postId])
    if (!post) return <p>Loading...</p>;
    if (error) return <p>Error loading post.</p>;

const handleClick = () => {
    if (!isLoggedIn) {
        setShowLoginModal(true);
        return;
    }
};




      return (
    <div className="flex flex-col justify-center items-center w-full">
        <img src={post.image} alt={post.title} className="w-[80%] h-[600px] object-cover mt-10 lg:mt-[100px] rounded-3xl overflow-hidden" />

        <div id="content" className="flex flex-col lg:flex-row justify-between mt-8 w-full max-w-[1200px] mx-auto md:gap-5">

            <div id="left" className="flex-1 flex flex-col ">
            <p>
                <span className="text-sm font-medium text-white bg-indigo-500 px-3 py-1 rounded-full w-fit">
                {post.category}</span> | {new Date(post.date).toLocaleDateString()}
            </p>
            <h1 className="!text-3xl mt-[20px]">{post.title}</h1>
            <div className="markdown">
                <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>
                <div className="flex flex-row justify-between items-center bg-gray-200 p-[10px] rounded-2xl mt-[30px]">
                    <div className="w-[100px] border p-[10px] rounded-3xl" onClick={handleClick}>
                        <SmilePlus />
                        
                    </div>
                    <div className="flex flex-row gap-[10px]">
                        <button onClick={() => {
                            navigator.clipboard.writeText(shareLink);
                            toast.custom((t) => (
                                <div className="bg-green-500 text-white p-4 rounded-sm flex justify-between items-start max-w-md w-full">
                                <div>
                                    <h2 className="font-bold text-lg mb-1">Copied!</h2>
                                    <p className="text-sm">
                                    This article has been copied to your clipboard.
                                    </p>
                                </div>
                                <button
                                    onClick={() => toast.dismiss(t)}
                                    className="text-white hover:text-gray-200"
                                >
                                    <X size={20} />
                                </button>
                                </div>
                            ));
                            }}
                        className="w-[100px] p-[10px] bg-white border rounded-3xl flex flex-row gap-[10px] ">
                        <Copy />
                        Copy
                        </button>
                        <button  onClick={() => window.open(
                        `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareLink)}`,"_blank"
                        )} 
                        className ="link-curcle"
                        >
                        <Linkedin className=' hover:cursor-pointer'/>
                        </button>
                        <button 
                        onClick={() => window.open(
                        `https://twitter.com/share?&url=${encodeURIComponent(shareLink)}`,"_blank"
                        )} 
                        className ="link-curcle">
                        <Twitter className=' hover:cursor-pointer'/>
                        </button>
                        <button 
                          onClick={() => window.open(
                        `https://www.instagram.com/share?&url=${encodeURIComponent(shareLink)}`,"_blank"
                        )} 
                        className ="link-curcle"
                        >
                        <Instagram className=' hover:cursor-pointer'/>
                        </button>
                    </div>

                </div>
                    <div className="flex flex-col gap-2 mt-[30px]">
                        <h2>Comment</h2>
                        <TextareaDemo placeholder="What are your thoughts?" />
                        <div className="flex justify-end">
                            <button className="px-4 py-2 bg-blue-500 text-white rounded" type="submit" onClick={handleClick}>
                            Send
                            </button>
                        </div>
                    </div>
                        <div className="space-y-6 px-4 my-[20px]">
                        {comments.map((comment, index) => (
                        <div key={index} className="flex flex-col gap-[20px] mb-4">
                            <div className="flex space-x-4">
                            <div className="flex-shrink-0">
                                <img
                                src={comment.image}
                                alt={comment.name}
                                className="rounded-full w-12 h-12 object-cover"
                                />
                            </div>
                            <div className="flex-grow">
                                <div className="flex flex-col items-start justify-between">
                                <h4 className="font-semibold">{comment.name}</h4>
                                <span className="text-sm text-gray-500">{comment.date}</span>
                                </div>
                            </div>
                            </div>
                            <p className=" text-gray-600">{comment.comment}</p>
                            {index < comments.length - 1 && (
                            <hr className="border-gray-300 my-4" />
                            )}
                            </div>
                            ))}
                        </div>
            </div>
            
            <div id="right" className="bg-[#EFEEEB] rounded-3xl w-full lg:w-[300px] p-6 lg:sticky lg:top-10 mt-8 lg:mt-0 h-auto self-start">
                <div className="flex items-center mb-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
                        <img
                            src="/herosection.png"
                            alt="Thompson P."
                            className="object-cover w-16 h-16"
                        />
                    </div>
                    <div>
                        <p className="text-sm">Author</p>
                        <h3 className="text-2xl font-bold">Thompson P.</h3>
                    </div>
                </div>
                <hr className="border-gray-300 mb-4" />
                <div className="text-muted-foreground space-y-4">
                    <p>
                        I am a pet enthusiast and freelance writer who specializes in animal
                        behavior and care. With a deep love for cats, I enjoy sharing insights
                        on feline companionship and wellness.
                    </p>
                    <p>
                        When I&apos;m not writing, I spend time volunteering at my local animal
                        shelter, helping cats find loving homes.
                    </p>
                </div>
            </div>

            {/* Login Modal */}
            {showLoginModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-xl p-8 w-[400px] text-center relative">
                        <button
                            className="absolute top-2 right-2 text-gray-500 text-xl"
                            onClick={() => setShowLoginModal(false)}
                        >
                            &times;
                        </button>
                        <h2 className="text-xl font-bold mb-4">
                            Create an account to continue
                        </h2>
                        <button className="px-6 py-2 bg-black text-white rounded-full mb-4">
                            Create account
                        </button>
                        <p className="text-sm text-gray-500">
                            Already have an account? <span className="underline cursor-pointer">Log in</span>
                        </p>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
    
  
}

