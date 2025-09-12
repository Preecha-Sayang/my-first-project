import { Linkedin } from 'lucide-react';
import { Twitter } from 'lucide-react';
import  {Instagram}  from 'lucide-react';

function Footer(){
    return(
        <footer className='w-[100%]  bg-gray-200 flex flex-col justify-between items-center p-[70px] gap-7  md:flex-row '>
            <div className='flex flex-row gap-[30px]'>
                <p className='text-black-500 text-2xl font-bold hover:cursor-pointer'>Get in thouch</p>
                <Linkedin className=' hover:cursor-pointer'/>
                <Twitter className=' hover:cursor-pointer'/>
                <Instagram className=' hover:cursor-pointer'/>
            </div>
            <a href="/"className='text-gray-500 text-2xl font-bold hover:cursor-pointer hover:underline'>Home page</a>
        </footer>
    )
}
export default Footer
