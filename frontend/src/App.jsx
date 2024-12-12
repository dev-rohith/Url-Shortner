import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/AuthForms";

import { ProtectedRoute, URLDetailPage } from "./components";
import Dashboard from "./pages/Dashboard";

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
      },
      {
        path: "/details/:id",
        element : <URLDetailPage />
      }
    ],
  },
]);

const App = () => {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};
export default App;
