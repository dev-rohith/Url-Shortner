import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { handleLogin, handleRegister } from "./authHandle";
import { Loader } from "lucide-react";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    input: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const navigate = useNavigate()
  const dispatch = useDispatch();



  const validate = (values) => {
    const errors = {};
    if (isLogin) {
      if (!values.input) errors.input = "Username or email is required";
      if (!values.password) errors.password = "Password is required";
    } else {
      if (!values.username) errors.username = "Username is required";
      if (!values.email) {
        errors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(values.email)) {
        errors.email = "Email is invalid";
      }
      if (!values.password) {
        errors.password = "Password is required";
      } else if (values.password.length < 6) {
        errors.password = "Password must be at least 6 characters";
      }
    }
    return errors;
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate(formData);
    if (Object.keys(validationErrors).length === 0) {
     setIsLoading(true);
        if (isLogin) {
         await dispatch(handleLogin(formData, navigate));
        } else {
          await dispatch(handleRegister(formData));
        }   
      
      setFormData({ username: "", email: "", password: "", input: "" });
      setErrors({});
      setIsLoading(false);
    } else {
      setErrors(validationErrors);
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow">
        <h2 className="text-center text-2xl font-bold mb-6">
          {isLogin ? "Sign In" : "Create Account"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {isLogin ? (
            <div>
              <input
                type="text"
                name="input"
                value={formData.input}
                onChange={handleChange}
                placeholder="Username or Email"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              
            </div>
          ) : (
            <>
              <div>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Username"
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.username && (
                  <p className="text-red-500 text-sm mt-1">{errors.username}</p>
                )}
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>
            </>
          )}

          <div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
          >
            {isLoading && <Loader className="h-6 w-6 animate-spin"/>}{isLogin ? "Sign In" : "Sign Up"}
          </button>
        </form>

        <div className="text-center mt-4">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setFormData({ username: "", email: "", password: "", input: "" });
              setErrors({});
            }}
            className="text-blue-500 hover:underline"
          >
            {isLogin
              ? "Need an account? Sign up"
              : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
