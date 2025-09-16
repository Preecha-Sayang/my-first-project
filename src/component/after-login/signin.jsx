import { useState } from "react";


export default function SignupForm() {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.name && formData.username && formData.email && formData.password) {
      alert(`Sign up successful! Welcome, ${formData.name}!`);
    }
  };



  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center p-5 mt-10 md:mt-[50px]">
      <div className="bg-gray-300 p-12 rounded-lg  w-[70%] text-center shadow-md">
        <h1 className="text-3xl font-semibold text-gray-800 mb-10">Sign up</h1>
        
        <div className="space-y-5">
          <div className="text-left">
            <label className="block text-sm font-medium text-gray-600 mb-2" htmlFor="name">
              Name
            </label>
            <input 
              type="text" 
              id="name" 
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white rounded-md text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Full name"
              required
            />
          </div>

          <div className="text-left">
            <label className="block text-sm font-medium text-gray-600 mb-2" htmlFor="username">
              Username
            </label>
            <input 
              type="text" 
              id="username" 
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white rounded-md text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Username"
              required
            />
          </div>

          <div className="text-left">
            <label className="block text-sm font-medium text-gray-600 mb-2" htmlFor="email">
              Email
            </label>
            <input 
              type="email" 
              id="email" 
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white rounded-md text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Email"
              required
            />
          </div>

          <div className="text-left">
            <label className="block text-sm font-medium text-gray-600 mb-2" htmlFor="password">
              Password
            </label>
            <input 
              type="password" 
              id="password" 
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white rounded-md text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Password"
              required
            />
          </div>

          <button 
            onClick={handleSubmit}
            className="w-full px-4 py-3 bg-gray-800 text-white rounded-md font-medium hover:bg-gray-700 transition-colors mt-5"
          >
            Sign up
          </button>
        </div>

        <div className="mt-6 text-sm text-gray-600">
          Already have an account?
          <a href={'/login'}
            className="text-gray-800 underline font-medium hover:text-blue-600 bg-transparent border-none cursor-pointer"
          >
            Log in
          </a>
        </div>
      </div>
    </div>
  );
}