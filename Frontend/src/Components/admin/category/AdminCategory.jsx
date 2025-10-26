import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button"; // shadcn/ui Button component
import AllCategories from "./AllCategories";
import { FaPlusCircle } from "react-icons/fa";

const AdminCategory = () => {
  const navigate = useNavigate();

  const handleAddCategory = () => {
    navigate("create-category");
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Category Management
      </h1>
      <div className="flex justify-end mb-4">
        <Button
          onClick={handleAddCategory}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
          aria-label="Add a new category"
        >
          <FaPlusCircle className="h-5 w-5" />
          Add category
        </Button>
      </div>
      <AllCategories />
    </div>
  );
};

export default AdminCategory;