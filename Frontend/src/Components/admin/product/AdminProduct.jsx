import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button"; // shadcn/ui Button component
import AllProduct from "./AllProduct";
import { FaPlusCircle } from "react-icons/fa";

const AdminProduct = () => {
  const navigate = useNavigate();

  const handleAddProduct = () => {
    navigate("createproduct");
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-center text-gray-900 mb-6 md:text-4xl">
        Product Management
      </h1>
      <div className="flex justify-end mb-4">
        <Button
          onClick={handleAddProduct}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          <FaPlusCircle className="h-5 w-5" />
          Add Product
        </Button>
      </div>
      <AllProduct />
    </div>
  );
};

export default AdminProduct;