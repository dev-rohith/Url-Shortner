import { useState } from "react";
import { Copy, Link } from "lucide-react";
import axiosInstance from "../api/axiosInstance";
import toast from "react-hot-toast";

const UrlShortenerLanding = () => {
  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const validateUrl = (url) => {
    const urlPattern = new RegExp(
      "^(https?:\\/\\/)?" +
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" +
        "((\\d{1,3}\\.){3}\\d{1,3}))" +
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" +
        "(\\?[;&a-z\\d%_.~+=-]*)?" +
        "(\\#[-a-z\\d_]*)?$",
      "i"
    );
    return !!urlPattern.test(url);
  };

  const handleCreateShortUrl = async () => {
    setShortUrl("");
    setError("");

    if (!longUrl) {
      setError("Please enter a URL");
      return;
    }

    if (!validateUrl(longUrl)) {
      setError("Please enter a valid URL");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axiosInstance.post("/short", {
        longUrl: longUrl,
      });

      const generatedShortUrl = response.data.data.sortUrl;
      setShortUrl(`${import.meta.env.VITE_BACKEND_URL}/${generatedShortUrl}`);
      toast.success("successfully generated");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create short URL");
      toast.error("error while shorting url");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(shortUrl);
   toast.success('copied successfully')
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center justify-center">
        <div className="w-full max-w-xl bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
            Shorten Your URL
          </h1>

          <div className="flex mb-4">
            <input
              type="text"
              value={longUrl}
              onChange={(e) => setLongUrl(e.target.value)}
              placeholder="Enter your long URL"
              className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleCreateShortUrl}
              disabled={isLoading}
              className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 transition duration-300 flex items-center justify-center space-x-2 min-w-[120px]"
            >
              {isLoading ? (
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
              ) : (
                <Link size={20} />
              )}
              <span>{isLoading ? "Creating..." : "Shorten"}</span>
            </button>
          </div>

          {error && (
            <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
          )}

          {shortUrl && (
            <div className="flex items-center bg-green-50 border border-green-200 rounded-md p-3 mt-4">
              <input
                type="text"
                value={shortUrl}
                readOnly
                className="flex-grow bg-transparent focus:outline-none"
              />
              <button onClick={handleCopyUrl} className={"ml-2 text-green-600"}>
                <Copy size={20} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UrlShortenerLanding;
