import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../utility/authSlice";
import { BookmarkIcon, FileText, GraduationCap, Upload, User, LogOut } from "lucide-react";


const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/40">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2">
                <GraduationCap className="h-6 w-6 text-blue-600" />
                <span className="hidden font-bold sm:inline-block text-xl">LearnShare Central</span>
              </Link>
            </div>

            {isLoggedIn && (
              <nav className="hidden md:flex flex-1 justify-center">
                <ul className="flex items-center space-x-2">
                  <li>
                    <Link 
                      to="/notes" 
                      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300
                        ${isActive("/notes") 
                          ? "bg-blue-50/80 text-blue-600" 
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50/80"}`}
                    >
                      <FileText className="h-4 w-4" />
                      Notes
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/pyqs" 
                      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300
                        ${isActive("/pyqs") 
                          ? "bg-blue-50/80 text-blue-600" 
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50/80"}`}
                    >
                      <FileText className="h-4 w-4" />
                      PYQs
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="add-material" 
                      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300
                        ${isActive("/dashboard/add-material") 
                          ? "bg-blue-50/80 text-blue-600" 
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50/80"}`}
                    >
                      <Upload className="h-4 w-4" />
                      Upload
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="bookmarks" 
                      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300
                        ${isActive("/dashboard/bookmarks") 
                          ? "bg-blue-50/80 text-blue-600" 
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50/80"}`}
                    >
                      <BookmarkIcon className="h-4 w-4" />
                      Bookmarks
                    </Link>
                  </li>
                </ul>
              </nav>
            )}

            <div className="flex items-center gap-2">
              {!isLoggedIn ? (
                <>
                  <Link 
                    to="/login" 
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50/80 rounded-lg transition-all duration-300"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/signup" 
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all duration-300"
                  >
                    Register
                  </Link>
                </>
              ) : (
                <div className="relative group">
                  <button className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-50/80 transition-all duration-300">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">
                        {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                      </span>
                    </div>
                  </button>
                  <div className="absolute right-0 mt-2 w-56 rounded-lg shadow-lg py-1 bg-white/90 backdrop-blur-md border border-gray-200/80 invisible group-hover:visible transition-all duration-300">
                    <div className="px-4 py-2 text-sm border-b border-gray-200/80">
                      <p className="font-semibold text-gray-900">{user?.firstName} {user?.lastName}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <Link to="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50/80">
                      Dashboard
                    </Link>
                    <Link to="/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50/80">
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Link>
                    <Link to="/mynotes" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50/80">
                      My Notes
                    </Link>
                    <Link to="/mypyqs" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50/80">
                      My PYQs
                    </Link>
                    <div className="border-t border-gray-200/80">
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50/80"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Log out
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      {/* Spacer div to prevent content from hiding behind navbar */}
      <div className="h-16"></div>
    </>
  );
};

export default Navbar;
