import { useState } from "react";



export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isErrorEmail, setIsErrorEmail] = useState(false);
  const [isErrorPassword, setIsErrorPassword] = useState(false);

  const handleSubmit = () => {
    let valid = true;

    if (!email.trim()) {
      setIsErrorEmail(true);
      valid = false;
    } else {
      setIsErrorEmail(false);
    }

    if (!password.trim()) {
      setIsErrorPassword(true);
      valid = false;
    } else {
      setIsErrorPassword(false);
    }

    if (!valid) {
      
      try{

      }catch(){
        
      }
      // Add login logic here
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-gray-200 rounded-lg p-8 shadow-sm">
          <h2 className="text-2xl font-medium text-center mb-8 text-gray-800">
            Log in
          </h2>
          
          <div className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm text-gray-600 mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 ${
                  isErrorEmail ? "border-red-500" : "border-gray-300"
                }`}
              />
              {isErrorEmail && (
                <p className="text-red-500 text-xs mt-1">
                  Please enter a valid email.
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm text-gray-600 mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 ${
                  isErrorPassword ? "border-red-500" : "border-gray-300"
                }`}
              />
              {isErrorPassword && (
                <p className="text-red-500 text-xs mt-1">
                  Please enter your password.
                </p>
              )}
            </div>

            <div>
              <button
                onClick={handleSubmit}
                className="w-full bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              >
                Log in
              </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have any account?{" "}
              <a href="/SignUp" className="text-gray-800 hover:underline">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}