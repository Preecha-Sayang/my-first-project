{isMenuOpen && (
        <div className="md:hidden mt-4 bg-white rounded-xl shadow-lg p-4 w-full max-w-xs ml-auto mr-0 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <img src={manWithCatImage} alt="profile" className="w-12 h-12 rounded-full object-cover border border-gray-300" />
              <span className="font-semibold text-lg text-gray-800">Moodeng ja</span>
            </div>
            <button className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
              {/* Bell icon */}
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
        </div>
          <div className="space-y-1 mb-2">
            <button className="flex items-center w-full px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-700 font-medium">
              {/* Profile icon */}
              <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A9 9 0 1112 21a9 9 0 01-6.879-3.196z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Profile
            </button>
            <button className="flex items-center w-full px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-700 font-medium">
              {/* Reset password icon */}
              <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0-1.105.895-2 2-2s2 .895 2 2-.895 2-2 2-2-.895-2-2zm0 0V7m0 4v4m0 0a4 4 0 100-8 4 4 0 000 8z" />
              </svg>
              Reset password
            </button>
          </div>
          <hr className="my-2 border-gray-200" />
          <button className="flex items-center w-full px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-red-600 font-medium">
            {/* Logout icon */}
            <svg className="w-5 h-5 mr-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 11-4 0v-1m0-8V5a2 2 0 114 0v1" />
            </svg>
            Log out
          </button>
        </div>
      )}