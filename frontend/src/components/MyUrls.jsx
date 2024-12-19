import { useState, useEffect } from "react";
import { Edit2, Trash2, Eye, Copy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import {format} from 'date-fns'
import toast from "react-hot-toast";

const MyUrls = () => {
  const [urls, setUrls] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUrl, setSelectedUrl] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editForm, setEditForm] = useState({ sortUrl: "" });

  useEffect(() => {
    const fetchUrls = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get("/myUrls", {
          withCredentials: true,
        });
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

  const navigate = useNavigate();

  const handleDeleteUrl = async (urlId) => {
    try {
      await axiosInstance.delete(`url/${urlId}`);
      setUrls(urls.filter((url) => url._id !== urlId));
      setError("");
      toast.success('deleted successfully')
    } catch (err) {
      setError("Failed to delete URL");
      console.error(err);
    }
  };


  const handleCopyUrl = (shortUrl) => {
    navigator.clipboard.writeText(`http://localhost:3000/api/${shortUrl}`);
    toast.success('copied succssfully')
  };

  const handleViewDetails = (url) => {
    setSelectedUrl(url);
  };

  const closeDetailsModal = () => {
    setSelectedUrl(null);
  };

  const handleDetailsClick = (id) => {
    console.log(id);
    navigate(`/details/${id}`);
  };

  function handleEdit(id) {
    const editUrl = urls.find((url) => url._id === id);
    setEditForm(editUrl);
  }

  async function handleEditSubmit(event) {
    event.preventDefault();
    try{
    const response = await axiosInstance.put(`/url/${editForm._id}`, editForm)
    const editedUrl = response.data.data
    const updatedUrls = urls.map((url)=> editedUrl._id === url._id ? editedUrl : url)
    setUrls(updatedUrls)
    setIsEdit(false)
    toast.success('edited successfully')
    }catch(error){
      console.log(error.message)
      toast.error('url is already taken')
    }
  }

     {/*MODEL WINDOW*/}
  const renderUrlDetailsModal = () => {
    if (!selectedUrl) return null;
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-6">
        <div className="bg-white rounded-lg p-6 w-200 ">
          <h2 className="text-xl font-bold mb-4 text-gray-800">URL Details</h2>

          <div className="space-y-2 overflow-auto">
            <span className="overflow-scroll">
              <strong>Long URL:</strong> {selectedUrl.longUrl}
            </span>
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

     {/*LOADING*/}
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">My URLs</h1>
      {error && <div className="text-red-500 text-center p-4">{error}</div>}

      {urls.length === 0 ? (
        <div className="text-center text-gray-500">No URLs created yet</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {urls.map((url) => (
            <div
              key={url._id}
              className="hover:cursor-pointer bg-white rounded-lg shadow-md p-4 relative"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p
                    onClick={() => {
                      handleDetailsClick(url._id);
                    }}
                    className="text-sm text-gray-600 truncate max-w-[200px]"
                  >
                    {url.longUrl}
                  </p>
                  {isEdit ? (
                    <input
                      className="border-2"
                      value={editForm.sortUrl}
                      onChange={(e) =>
                        setEditForm({ ...editForm, sortUrl: e.target.value })
                      }
                    />
                  ) : (
                    <a
                      href={`http://localhost:3000/api/${url.sortUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {url.sortUrl}
                    </a>
                  )}
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
                {isEdit ? (
                  <input type="date" className="text-sm text-gray-500"
                   value={format(editForm.urlExpiry, 'yyyy-MM-dd')}
                  />
                ) : (
                  <span className="text-sm text-gray-500">
                    Expire: {new Date(url.urlExpiry).toLocaleDateString()}
                  </span>
                )}
                <div className="flex space-x-2">
                  {isEdit && (
                    <button
                      className="text-blue-500 hover:text-blue-700 bg-"
                      onClick={handleEditSubmit}
                    >
                      save
                    </button>
                  )}
                  <button
                    className="text-blue-500 hover:text-blue-700"
                    title="Edit URL"
                    onClick={() => {
                      setIsEdit(!isEdit);
                      handleEdit(url._id);
                    }}
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

     
      {renderUrlDetailsModal()}
    </div>
  );
};

export default MyUrls;
