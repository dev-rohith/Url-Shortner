import { useState, useEffect } from "react";
import axios from "axios";
import { Edit2, Trash2, Eye, Copy } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MyUrls = () => {
  const [urls, setUrls] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUrl, setSelectedUrl] = useState(null);

  // Fetch URLs on component mount
  useEffect(() => {
    const fetchUrls = async () => {
      try {
        setIsLoading(true);
        // Replace with your actual API endpoint
        const response = await axios.get("http://localhost:3000/api/myUrls", {
          withCredentials: true,
        });
        console.log(response.data.urls);
        setUrls(response.data.urls);
      } catch (err) {
        setError("Failed to fetch URLs");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUrls();
  }, []);

  console.log(error);
  const navigate = useNavigate()

  const handleDeleteUrl = async (urlId) => {
    try {
      await axios.delete(`http://localhost:3000/api/urls/${urlId}`);
      // Remove the deleted URL from the state
      setUrls(urls.filter((url) => url._id !== urlId));
    } catch (err) {
      setError("Failed to delete URL");
      console.error(err);
    }
  };

  const handleCopyUrl = (shortUrl) => {
    navigator.clipboard.writeText(`http://localhost:3000/${shortUrl}`);
  };

  const handleViewDetails = (url) => {
    setSelectedUrl(url);
  };

  const closeDetailsModal = () => {
    setSelectedUrl(null);
  };

  const renderUrlDetailsModal = () => {
    if (!selectedUrl) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-96 max-w-full">
          <h2 className="text-xl font-bold mb-4 text-gray-800">URL Details</h2>

          <div className="space-y-2">
            <p>
              <strong>Long URL:</strong> {selectedUrl.longUrl}
            </p>
            <p>
              <strong>Short URL:</strong>
              <span className="text-blue-600">
                http://localhost:3000/{selectedUrl.sortUrl}
              </span>
            </p>
            <p>
              <strong>Created At:</strong>{" "}
              {new Date(selectedUrl.createdAt).toLocaleString()}
            </p>
            <p>
              <strong>Expiry:</strong>{" "}
              {new Date(selectedUrl.urlExpiry).toLocaleString()}
            </p>

            <div className="mt-4">
              <h3 className="font-semibold mb-2">Statistics</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-gray-100 p-2 rounded">
                  <p className="text-sm text-gray-600">Total Clicks</p>
                  <p className="font-bold">{selectedUrl.totalClicks || 0}</p>
                </div>
                <div className="bg-gray-100 p-2 rounded">
                  <p className="text-sm text-gray-600">Last Accessed</p>
                  <p className="text-sm">
                    {selectedUrl.lastAccessedAt
                      ? new Date(selectedUrl.lastAccessedAt).toLocaleString()
                      : "Never"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={closeDetailsModal}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  const handleDetailsClick = (id) => {
    console.log(id);
    navigate(`/details/${id}`)
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="2" x2="12" y2="6"></line>
            <line x1="12" y1="18" x2="12" y2="22"></line>
            <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
            <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
            <line x1="2" y1="12" x2="6" y2="12"></line>
            <line x1="18" y1="12" x2="22" y2="12"></line>
            <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
            <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
          </svg>
        </div>
      </div>
    );
  }

  // if (error) {
  //   return (
  //     <div className="text-red-500 text-center p-4">
  //       {error}
  //     </div>
  //   );
  // }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">My URLs</h1>

      {urls.length === 0 ? (
        <div className="text-center text-gray-500">No URLs created yet</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {urls.map((url) => (
            <div
              onClick={() => {
                handleDetailsClick(url._id);
              }}
              key={url._id}
              className="hover:cursor-pointer bg-white rounded-lg shadow-md p-4 relative"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-sm text-gray-600 truncate max-w-[200px]">
                    {url.longUrl}
                  </p>
                  <a
                    href={`http://localhost:3000/${url.sortUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {url.sortUrl}
                  </a>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleCopyUrl(url.sortUrl)}
                    className="text-gray-500 hover:text-blue-600"
                    title="Copy Short URL"
                  >
                    <Copy size={18} />
                  </button>
                  <button
                    onClick={() => handleViewDetails(url)}
                    className="text-gray-500 hover:text-green-600"
                    title="View Details"
                  >
                    <Eye size={18} />
                  </button>
                </div>
              </div>

              <div className="mt-2 flex justify-between items-center border-t pt-2">
                <span className="text-sm text-gray-500">
                  Created: {new Date(url.createdAt).toLocaleDateString()}
                </span>
                <div className="flex space-x-2">
                  <button
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
      )}

      {/* URL Details Modal */}
      {renderUrlDetailsModal()}
    </div>
  );
};

export default MyUrls;
