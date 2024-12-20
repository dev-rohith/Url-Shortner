import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { MyUrls, ProtectedRoute, URLDetails } from "./components";
import Dashboard from "./pages/Dashboard";
import UrlShortenerLanding from "./pages/UrlShortenerLanding";
import AuthForm from "./pages/auth/AuthForms";


const router = createBrowserRouter([
  {
    path: "/login",
    element: <AuthForm />,
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
