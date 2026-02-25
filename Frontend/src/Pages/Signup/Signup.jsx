import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import signupimg from "../../assets/Images/signup/img.webp";
import axios from "axios";
import { toast } from "react-toastify";
import { UserContext } from "../../Context/UserContext";
import { useRegisterUserMutation } from "../../redux/api/userAPI";
import { Button } from "@/Components/ui/button"; // shadcn/ui Button
import { Input } from "@/Components/ui/input"; // shadcn/ui Input
import { Label } from "@/Components/ui/label"; // shadcn/ui Label

const Signup = () => {
  const { user, loginUser } = useContext(UserContext);
  const [registerUser, { isLoading }] = useRegisterUserMutation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    age: "",
    photo: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];

    if (file && !allowedTypes.includes(file.type)) {
      toast.error(
        "Invalid file type! Please upload an image (JPG, PNG, GIF).",
        {
          position: "top-center",
          autoClose: 3000,
          theme: "dark",
        }
      );
      return;
    }

    const cloudName = `${import.meta.env.VITE_CLOUD_NAME}`;
    const uploadPreset = "IBM_Project";
    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    try {
      toast.info("Uploading image, please wait...", {
        position: "top-center",
        autoClose: 3000,
        theme: "dark",
      });

      const res = await axios.post(uploadUrl, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const uploadedFileUrl = res.data.secure_url;

      toast.success("File uploaded successfully!", {
        position: "top-center",
        autoClose: 3000,
        theme: "dark",
      });

      console.log("Uploaded File URL:", uploadedFileUrl);
      setFormData((prevData) => ({
        ...prevData,
        photo: uploadedFileUrl,
      }));
    } catch (error) {
      toast.error(`File upload failed: ${error.message}`, {
        position: "top-center",
        autoClose: 5000,
        theme: "dark",
      });
      console.error("Error uploading file:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    try {
      const { name, email, password } = formData;
      if (!name || !email || !password) {
        toast("⚠️ All fields are mandatory", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: true,
          draggable: true,
          theme: "dark",
        });
        return;
      }

      const res = await registerUser(formData).unwrap();

      toast.success("SignUp Successful", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        draggable: true,
        theme: "dark",
      });

      console.log(res);
      loginUser(res.user, res.token);
      navigate("/");
    } catch (error) {
      console.error("SignUp Error:", error);

      toast.error(`❌ SignUp failed: ${error.data?.message || error.message}`, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        theme: "dark",
      });
    }
  };

  useEffect(() => {
    if (user) {
      return navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="flex min-h-[calc(100vh-2rem)] items-center justify-center bg-gray-100 mt-[-50px]">
      <div className="flex w-full max-w-5xl flex-col-reverse md:flex-row items-center">
        {/* Image Container */}
        <div className="flex-1 flex justify-center items-center p-4">
          <img
            src={signupimg}
            alt="Signup"
            className="max-w-full h-auto object-contain"
          />
        </div>

        {/* Form Container */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-8 bg-white rounded-2xl shadow-lg border border-blue-500 max-w-lg w-full">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Signup</h2>
          <form onSubmit={handleSubmit} className="w-full space-y-3">
            {/* Name and Email Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700">
                  Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full border-gray-400 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter your name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full border-gray-400 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password (Full Width) */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full border-gray-400 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter your password"
              />
            </div>

            {/* Phone and Age Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-gray-700">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border-gray-400 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter your phone number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age" className="text-gray-700">
                  Age
                </Label>
                <Input
                  id="age"
                  type="tel"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full border-gray-400 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter your age"
                />
              </div>
            </div>

            {/* Photo Upload (Full Width) */}
            <div className="space-y-2">
              <Label htmlFor="photo" className="text-gray-700">
                Upload Photo
              </Label>
              <Input
                id="photo"
                type="file"
                name="photo"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full border-gray-400 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* Photo Preview */}
            {formData.photo && (
              <div className="flex flex-col items-center">
                <h3 className="text-sm font-medium text-gray-700">Selected Photo:</h3>
                <img
                  src={formData.photo}
                  alt="Selected"
                  className="w-20 h-auto mt-2 rounded-md"
                />
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-md transition-colors duration-300"
            >
              {isLoading ? "Signing up..." : "Sign Up"}
            </Button>
          </form>

          {/* Links */}
          <div className="mt-3 flex items-center justify-center gap-2 text-sm">
            <Link
              to="/forgot-password"
              className="text-blue-500 hover:underline"
            >
              Forgot Password?
            </Link>
            <span className="text-gray-400">|</span>
            <Link to="/login" className="text-blue-500 hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;