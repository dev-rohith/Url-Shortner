import { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { Link2, Calendar, Globe } from "lucide-react";

import { Link, useParams } from "react-router-dom";
import Maps from "./Maps";
import axiosInstance from "../utils/axiosInstance";
import MapLocations from "./MapLocations";

const URLDetailPage = () => {
  const [urlData, setUrlData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { id } = useParams();

  useEffect(() => {
    const fetchURLData = async () => {
      try {
        const response = await axiosInstance.get(`/url/${id}`, {
          withCredentials: true,
        });
        console.log(response.data.data);
        setUrlData(response.data.data);
        setIsLoading(false);
      } catch (error) {
        setError(error.message);
        setIsLoading(false);
      }
    };

    fetchURLData();
  }, []);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  const deviceData = urlData
    ? Object.entries(urlData.device || {}).map(([name, value]) => ({
        name,
        value,
      }))
    : [];

  const countryData = [
    ["Country", "Popularity"],
    ...Object.entries(urlData.country),
  ];

  return (
    <div className="container mx-auto p-4 bg-gray-50 min-h-screen">
      <div className="bg-white shadow-lg rounded-xl overflow-hidden max-w-6xl mx-auto">
        {/* HEADER SECTION */}
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
            <div className="flex items-center space-x-3">
              <Link2 className="h-6 w-6 text-blue-500" />
              <span className="text-gray-700">{urlData.longUrl}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar className="h-6 w-6 text-green-500" />
              <span className="text-gray-700">
                Expiry: {new Date(urlData.urlExpiry).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <Globe className="h-6 w-6 text-purple-500" />
              <span className="text-gray-700">
                Short URL: {urlData.sortUrl}
              </span>
            </div>
          </div>

          {/* PIE CHART */}
          <div className="bg-white shadow rounded-lg p-4">
            <h3 className="text-center font-semibold mb-4">
              Device Distribution
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={deviceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {deviceData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* MAPS SECTION */}
        <div className="p-6 grid md:grid-cols-2 gap-4">
          <div className="bg-white shadow rounded-lg p-4">
            <h3 className="text-center font-semibold mb-4">Access Locations</h3>
            {/* ACCESS LOCATIONS */}
            <MapLocations AccessLocations={urlData.locations} />
          </div>
          {/* COUNTRY MAP */}
          <Maps countryData={countryData} />
        </div>
      </div>
    </div>
  );
};

export default URLDetailPage;
