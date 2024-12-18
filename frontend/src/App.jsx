import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/AuthForms";

import { MyUrls, ProtectedRoute, URLDetails } from "./components";
import Dashboard from "./pages/Dashboard";
import UrlShortenerLanding from "./pages/UrlShortenerLanding";


const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <Dashboard />,
        children: [
          {
            index: true,
            element: <UrlShortenerLanding />,
          },
          {
            path: "/myurls",
            element: <MyUrls />,
          },
        ],
      },
      {
        path: "/details/:id",
        element: <URLDetails
         />,
      },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};
export default App;
