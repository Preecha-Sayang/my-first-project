function ResetPassword() {
  return (
    <div className="bg-gray-400 rounded-2xl p-[40px] flex flex-col gap-[40px]">
        <form className="flex flex-col gap-[28px]">
            <div className="flex flex-col gap-0.5">
                <label htmlFor="password-current"> Current password</label>
                <input type="text" id="password-current" 
                placeholder="test" 
                className="h-[50px] bg-white p-4 rounded-xl"
                />
            </div>

            
            <div className="flex flex-col gap-0.5">
                <label htmlFor="password-current"> New password</label>
                <input type="text" id="password-current" 
                placeholder="test" 
                className="h-[50px] bg-white p-4 rounded-xl"
                />
            </div>

            
            <div className="flex flex-col gap-0.5">
                <label htmlFor="password-current">Confirm New password</label>
                <input type="text" id="password-current" 
                placeholder="test" 
                className="h-[50px] bg-white p-4 rounded-xl"
                />
            </div>
        </form>
        <button
          className="flex justify-center items-center
            w-[200px] h-[50px] rounded-4xl bg-black text-white
            hover:cursor-pointer"
          type="summit"
        >
          Reset Password
        </button>
      </div>
  );
}

export default ResetPassword;
