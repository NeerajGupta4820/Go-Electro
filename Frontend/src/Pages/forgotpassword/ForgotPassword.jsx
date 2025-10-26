import { useState, useEffect } from "react";
import { useResetPasswordMutation } from "../../redux/api/userAPI";
import forgotPasswordImage from "../../assets/Images/forgotPassword/fimg.avif";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button"; // shadcn/ui Button
import { Input } from "@/components/ui/input"; // shadcn/ui Input
import { Label } from "@/components/ui/label"; // shadcn/ui Label

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  useEffect(() => {
    const emailInput = document.getElementById("email");
    if (emailInput) {
      emailInput.focus();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("❌ Passwords do not match.", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        theme: "dark",
      });
      return;
    }

    try {
      const result = await resetPassword({ email, newPassword, confirmPassword }).unwrap();
      toast.success(result.message || "Your password has been reset successfully.", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        draggable: true,
        theme: "dark",
      });
      navigate("/login");
    } catch (error) {
      toast.error(
        `❌ Failed to reset password: ${error.response?.data?.message || error.message}`,
        {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: true,
          theme: "dark",
        }
      );
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-2rem)] items-center justify-center bg-gray-100 pt-4">
      <div className="flex w-full max-w-5xl flex-col-reverse md:flex-row items-center">
        {/* Image Container */}
        <div className="flex-1 flex justify-center items-center p-4">
          <img
            src={forgotPasswordImage}
            alt="Forgot Password"
            className="max-w-full h-auto object-contain"
          />
        </div>

        {/* Form Container */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-8 bg-white rounded-2xl shadow-lg border border-blue-500 max-w-md w-full mt-[-50px]">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Reset Password</h2>
          <form onSubmit={handleSubmit} className="w-full space-y-3">
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
              <Label htmlFor="new-password" className="text-gray-700">
                New Password
              </Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full border-gray-400 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter new password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password" className="text-gray-700">
                Confirm Password
              </Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full border-gray-400 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Confirm new password"
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-md transition-colors duration-300"
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
          <div className="mt-3 flex items-center justify-center gap-2 text-sm">
            <Link to="/login" className="text-blue-500 hover:underline">
              Back to Login
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

export default ForgotPassword;