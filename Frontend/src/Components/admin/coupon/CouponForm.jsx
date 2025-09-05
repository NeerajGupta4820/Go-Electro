import { useState } from "react";
import { toast } from "react-toastify";
import "./CouponForm.css";

const CouponForm = ({
  products,
  createCoupon,
  updateCoupon,
  editCoupon,
  onClose,
}) => {
  const [couponData, setCouponData] = useState(
    editCoupon || { code: "", discount: "", products: [] }
  );

  const toggleProductSelection = (productId) => {
    const updatedProducts = couponData.products.includes(productId)
      ? couponData.products.filter((id) => id !== productId)
      : [...couponData.products, productId];
    setCouponData({ ...couponData, products: updatedProducts });
  };

  const handleSubmit = async () => {
    try {
      if (editCoupon) {
        await updateCoupon(couponData).unwrap();
        toast.success("Updated successfully!", { theme: "dark" });
      } else {
        await createCoupon(couponData).unwrap();
        toast.success("Added successfully!", { theme: "dark" });
      }
      onClose();
    } catch (error) {
      toast.error(`Failed to save coupon: ${error.message}`, { theme: "dark" });
      console.error(error);
    }
  };

  return (
    <div className="coupon-form">
      <h3>{editCoupon ? "Update Coupon" : "Add New Coupon"}</h3>
      <div>
      <input
        type="text"
        placeholder="Coupon Code"
        value={couponData.code}
        onChange={(e) => setCouponData({ ...couponData, code: e.target.value })}
      />
      <input
        type="number"
        placeholder="Discount Amount"
        value={couponData.discount}
        onChange={(e) =>
          setCouponData({ ...couponData, discount: e.target.value })
        }
      />
      </div>

      <div>
      <button onClick={handleSubmit} className="submit-btn">
        {editCoupon ? "Update Coupon" : "Add Coupon"}
      </button>
      <button onClick={onClose} className="cancel-btn">
        Cancel
      </button>
      </div>
      <div className="product-selection">
        <h4>Select Products</h4>
        <table>
          <thead>
            <tr>
              <th>Select</th>
              <th>Title</th>
              <th>Image</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>
                  <input
                    type="checkbox"
                    checked={couponData.products.includes(product._id)}
                    onChange={() => toggleProductSelection(product._id)}
                  />
                </td>
                <td>{product.title}</td>
                <td>
                  <img
                    src={product.images[0]?.imageLinks[0]}
                    className="product-table-image"
                    alt="product"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default CouponForm;
