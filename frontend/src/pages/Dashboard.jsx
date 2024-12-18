import {
    LogOut,
    TvIcon,
    UnfoldHorizontal,
  } from "lucide-react";
  import { Link, Outlet } from "react-router-dom";
  import { useDispatch } from "react-redux";
  import { logout } from "../pages/authSlice";

  
  const Dashboard = () => {
      const dispatch = useDispatch()
  
    function handleLogout() {
      dispatch(logout())
    }
  
    return (
      <div className="bg-gray-50 min-h-screen p-6">
        <div className="container mx-auto">
          <nav className="bg-white shadow-md">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
              <Link
                to="/"
                className="flex items-center text-xl font-bold text-blue-600"
              >
                <TvIcon className="mr-2" /> Dashbord
              </Link>
              <div className="flex items-center space-x-4">
                <Link
                  to="/myurls"
                  className="flex items-center text-gray-700 hover:text-blue-600"
                >
                  <UnfoldHorizontal className="mr-1" size={18} /> My urls
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-red-500 hover:text-red-700 flex items-center"
                >
                  <LogOut className="mr-1" size={18} /> Logout
                </button>
              </div>
            </div>
          </nav>

          <Outlet />
  
        </div>
      </div>
    );
  };
  
  export default Dashboard;
  