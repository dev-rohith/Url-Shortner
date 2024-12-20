import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { Link2, Calendar, Globe, Edit, Save } from "lucide-react";
import { format } from "date-fns";

import axiosInstance from "../utils/axiosInstance";
import toast from "react-hot-toast";

import CountryMap from "./CountryMap";
import LocationMap from "./LocationMap";
import DeviceChart from "./DeviceChart";
import Spinner from "./Spinner";

const URLDetailPage = () => {
  const [urlData, setUrlData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editOn, setEditOn] = useState(false);
  const [error, setError] = useState(null);

  const { id } = useParams();

  useEffect(() => {
    const fetchURLData = async () => {
      try {
        const response = await axiosInstance.get(`/url/${id}`, {
          withCredentials: true,
        });
        setUrlData(response.data.data);
        setIsLoading(false);
      } catch (error) {
        setError(error.message);
        setIsLoading(false);
      }
    };

    fetchURLData();
  }, []);

  async function handleEditData() {
    try {
      const response = await axiosInstance.put(`url/${urlData._id}`, urlData);
      setUrlData(response.data.data);
      setEditOn(false);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  //  DATA FORMATING
  const deviceData = urlData
    ? Object.entries(urlData.device || {}).map(([name, value]) => ({
        name,
        value,
      }))
    : [];

  const countryData = urlData
    ? [["Country", "Popularity"], ...Object.entries(urlData.country)]
    : [];

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }
  return (
    <div className="container mx-auto p-4 bg-gray-50 min-h-screen">
      <div className="bg-white shadow-lg rounded-xl overflow-hidden max-w-6xl mx-auto">
        {/* HEAD SECTION */}
        <div className="px-6 py-4 bg-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">URL Statistics</h2>
          <Link
            to="/myUrls"
            className="bg-blue-800 px-4 py-2 text-slate-50 font-medium rounded-lg"
          >
            &lt;- Back
          </Link>
        </div>

        {/* URL INFORMATION */}
        <div className="p-6 grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <button
              onClick={() => {
                setEditOn(!editOn);
              }}
              className="text-orange-600"
            >
              <Edit />
            </button>

            <button onClick={handleEditData} className="ml-10 text-green-500">
              <Save />
            </button>

            <div className="flex items-center space-x-3">
              <Link2 className="h-6 w-6 text-blue-500" />

              <span className="text-gray-700">{urlData.longUrl}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar className="h-6 w-6 text-green-500" />
              {editOn ? (
                <input
                  className="border-2"
                  type="date"
                  value={format(urlData.urlExpiry, "yyyy-MM-dd")}
                />
              ) : (
                <span className="text-gray-700">
                  Expiry: {new Date(urlData.urlExpiry).toLocaleDateString()}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-3">
              <Globe className="h-6 w-6 text-purple-500" />
              {editOn ? (
                <input
                  className="border-2"
                  type="text"
                  value={urlData.sortUrl}
                  onChange={(e) => {
                    setUrlData({ ...urlData, sortUrl: e.target.value });
                  }}
                />
              ) : (
                <span className="text-gray-700">
                  Short URL: {urlData.sortUrl}
                </span>
              )}
            </div>
          </div>

          {/* PIE CHART */}
          <DeviceChart deviceData={deviceData} />
        </div>

        {/* MAPS SECTION */}
        <div className="p-6 grid md:grid-cols-2 gap-4">
          <div className="bg-white shadow rounded-lg p-4">
            <h3 className="text-center font-semibold mb-4">Access Locations</h3>
            {/* ACCESS LOCATIONS */}
            <LocationMap AccessLocations={urlData.locations} />
          </div>

          <div className="bg-white shadow rounded-lg p-4">
            <h3 className="text-center font-semibold mb-4">Users Locations</h3>
            {/* COUNTRY MAP */}
            <CountryMap countryData={countryData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default URLDetailPage;
