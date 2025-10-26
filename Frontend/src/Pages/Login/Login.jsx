import { useState, useEffect } from "react";
import { useLoginUserMutation, useGoogleLoginMutation } from "../../redux/api/userAPI.js";
import loginImage from "../../assets/Images/login/img.webp";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { setUser } from "../../redux/slices/userSlice";
import { setCartData } from "../../redux/slices/cartSlice";
import { auth, googleProvider } from "./Firebase.jsx";
import { signInWithPopup } from "firebase/auth";
import { Button } from "@/components/ui/button"; // shadcn/ui Button
import { Input } from "@/components/ui/input"; // shadcn/ui Input
import { Label } from "@/components/ui/label"; // shadcn/ui Label

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loginUser, { isLoading: isLoggingIn }] = useLoginUserMutation();
  const [googleLogin, { isLoading: isGoogleLoggingIn }] = useGoogleLoginMutation();

  useEffect(() => {
    const emailInput = document.getElementById("email");
    if (emailInput) {
      emailInput.focus();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      toast.error("Please enter a valid email.");
      return;
    }

    try {
      const result = await loginUser({ email, password }).unwrap();
      if (result.success) {
        const { token, user, cart } = result;

        dispatch(setUser({ user, token }));
        dispatch(setCartData({ cart }));
        localStorage.setItem("cartData", JSON.stringify(cart));

        toast.success("Login successful!", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: true,
          draggable: true,
          theme: "dark",
        });

        navigate("/");
      }
    } catch (error) {
      toast.error(
        `❌ Login failed: ${error.response?.data?.message || error.message}`,
        {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: true,
          theme: "dark",
        }
      );
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const token = await user.getIdToken();

      const response = await googleLogin({
        email: user.email,
        name: user.displayName,
        photo: user.photoURL,
        firebaseToken: token,
      }).unwrap();

      if (response.success) {
        dispatch(setUser({ user: response.user, token: response.token }));
        dispatch(setCartData({ cart: response.cart }));
        localStorage.setItem("cartData", JSON.stringify(response.cart));

        toast.success("Login successful with Google!", {
          position: "top-center",
          autoClose: 5000,
          draggable: true,
          theme: "dark",
        });

        navigate("/");
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      toast.error(`❌ Google login failed: ${error.message}`, {
        position: "top-center",
        autoClose: 5000,
        theme: "dark",
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 mt-[-50px]">
      <div className="flex w-full max-w-5xl flex-col-reverse md:flex-row items-center">
        {/* Image Container */}
        <div className="flex-1 flex justify-center items-center p-4">
          <img
            src={loginImage}
            alt="Login"
            className="max-w-full h-auto object-contain"
          />
        </div>

        {/* Form Container */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-10 bg-white rounded-2xl shadow-lg border border-blue-500 max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Login</h2>
          <form onSubmit={handleSubmit} className="w-full space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border-gray-400 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter your email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border-gray-400 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter your password"
              />
            </div>
            <Button
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-md transition-colors duration-300"
            >
              {isLoggingIn ? "Logging in..." : "Login"}
            </Button>
            <Button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isGoogleLoggingIn}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md flex items-center justify-center gap-2 mt-4 transition-colors duration-300 hover:-translate-y-0.5"
            >
              <FcGoogle className="w-6 h-6 bg-white rounded-full p-1" />
              <span>{isGoogleLoggingIn ? "Signing in..." : "Sign in with Google"}</span>
            </Button>
          </form>
          <div className="mt-4 flex items-center justify-center gap-2 text-sm">
            <Link
              to="/forgot-password"
              className="text-blue-500 hover:underline"
            >
              Forgot Password?
            </Link>
            <span className="text-gray-400">|</span>
            <Link to="/signup" className="text-blue-500 hover:underline">
              Signup
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;