import React, { useState, useEffect } from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Link, 
  useParams, 
  useNavigate 
} from 'react-router-dom';
import { 
  Copy, 
  Edit2, 
  Trash2, 
  User, 
  LogOut, 
  Link as LinkIcon, 
   
} from 'lucide-react';
import axios from 'axios';

// API Base URL - replace with your actual backend URL
const API_BASE_URL = 'http://localhost:5000/api';

// Authentication Context
const AuthContext = React.createContext(null);

// Layout Component with Navbar
const Layout = ({ children }) => {
  const { user, logout } = React.useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="flex items-center text-xl font-bold text-blue-600">
            <LinkIcon className="mr-2" /> UrlShrink
          </Link>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link 
                  to="/my-urls" 
                  className="flex items-center text-gray-700 hover:text-blue-600"
                >
                  <LinkIcon className="mr-1" size={18} /> My URLs
                </Link>
                <Link 
                  to="/profile" 
                  className="flex items-center text-gray-700 hover:text-blue-600"
                >
                  <User className="mr-1" size={18} /> Profile
                </Link>
                <button 
                  onClick={logout} 
                  className="text-red-500 hover:text-red-700 flex items-center"
                >
                  <LogOut className="mr-1" size={18} /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
                <Link to="/signup" className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </nav>
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
};

// My URLs Component
const MyUrls = () => {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch URLs
  useEffect(() => {
    const fetchUrls = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_BASE_URL}/url`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUrls(response.data.urls);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch URLs');
        setLoading(false);
      }
    };

    fetchUrls();
  }, []);

  // Copy Short URL
  const handleCopyUrl = (shortUrl) => {
    navigator.clipboard.writeText(`http://localhost:3000/${shortUrl}`);
    // Add toast notification
  };

  // Delete URL
  const handleDeleteUrl = async (urlId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/url/${urlId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUrls(urls.filter(url => url._id !== urlId));
    } catch (err) {
      console.error('Failed to delete URL', err);
      // Add error handling/toast
    }
  };

  // Edit URL
  const handleEditUrl = (url) => {
    // Implement edit functionality or navigate to edit page
    console.log('Edit URL', url);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {urls.map((url) => (
        <div 
          key={url._id}  
          className="bg-white rounded-lg shadow-md p-4 relative" 
        > 
          <div className="flex justify-between items-start mb-2"> 
            <div> 
              <p className="text-sm text-gray-600 truncate max-w-[200px]"> 
                {url.longUrl} 
              </p>
              <Link
                to={`/url/${url._id}`}
                className="text-blue-600 hover:underline" 
              > 
                {url.sortUrl} 
              </Link>
            </div>
            <div className="flex space-x-2"> 
              <button  
                onClick={() => handleCopyUrl(url.sortUrl)} 
                className="text-gray-500 hover:text-blue-600" 
                title="Copy Short URL" 
              > 
                <Copy size={18} /> 
              </button>
            </div>
          </div> 
           
          <div className="mt-2 flex justify-between items-center border-t pt-2"> 
            <span className="text-sm text-gray-500"> 
              Created: {new Date(url.createdAt).toLocaleDateString()} 
            </span>
            <div className="flex space-x-2"> 
              <button  
                onClick={() => handleEditUrl(url)}
                className="text-blue-500 hover:text-blue-700" 
                title="Edit URL" 
              > 
                <Edit2 size={18} /> 
              </button>
              <button  
                onClick={() => handleDeleteUrl(url._id)} 
                className="text-red-500 hover:text-red-700" 
                title="Delete URL" 
              > 
                <Trash2 size={18} /> 
              </button>
            </div> 
          </div> 
        </div>
      ))}
    </div>
  );
};

// URL Analytics Component
const UrlAnalytics = () => {
  const { urlId } = useParams();
  const [urlDetails, setUrlDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUrlDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_BASE_URL}/url/${urlId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUrlDetails(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch URL details');
        setLoading(false);
      }
    };

    fetchUrlDetails();
  }, [urlId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!urlDetails) return <div>No URL details found</div>;

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">URL Analytics</h1>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-gray-600">Original URL:</p>
          <a 
            href={urlDetails.longUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-600 hover:underline break-all"
          >
            {urlDetails.longUrl}
          </a>
        </div>
        <div>
          <p className="text-gray-600">Short URL:</p>
          <a 
            href={`http://localhost:3000/${urlDetails.sortUrl}`} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-600 hover:underline"
          >
            {urlDetails.sortUrl}
          </a>
        </div>
        {/* Add more analytics details as needed */}
      </div>
    </div>
  );
};

// User Profile Component
const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_BASE_URL}/user/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch profile');
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!profile) return <div>No profile data</div>;

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">User Profile</h1>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-gray-600">Username:</p>
          <p>{profile.username}</p>
        </div>
        <div>
          <p className="text-gray-600">Email:</p>
          <p>{profile.email}</p>
        </div>
        <div>
          <p className="text-gray-600">Total URLs Created:</p>
          <p>{profile.totalUrls}</p>
        </div>
        <div>
          <p className="text-gray-600">Account Created:</p>
          <p>{new Date(profile.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};

// Main App Component
const App = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Login function
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('token', userData.token);
    navigate('/my-urls');
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Check authentication on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token with backend
      const verifyToken = async () => {
        try {
          const response = await axios.get(`${API_BASE_URL}/user/verify`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(response.data);
        } catch (err) {
          localStorage.removeItem('token');
        }
      };
      verifyToken();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <Routes>
        <Route path="/my-urls" element={<MyUrls />} />
        <Route path="/url/:urlId" element={<UrlAnalytics />} />
        <Route path="/profile" element={<Profile />} />
        {/* Add other routes like login, signup as needed */}
      </Routes>
    </AuthContext.Provider>
  );
};

// Wrapper Component with Router
const UrlShortenerApp = () => {
  return (
    <Router>
      <Layout>
        <App />
      </Layout>
    </Router>
  );
};

export default UrlShortenerApp;