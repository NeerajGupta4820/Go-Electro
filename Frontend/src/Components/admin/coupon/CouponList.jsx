import "./CouponList.css";

const CouponList = ({ coupons, isLoading, error, onEdit, onDelete, onAdd }) => {
  return (
    <div className="coupon-list">
      <h2>Coupons</h2>
      <button className="add-btn" onClick={onAdd}>
        New
      </button>

      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error loading coupons</p>
      ) : (
        <table className="coupon-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Discount</th>
              <th>Products</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon) => (
              <tr key={coupon._id}>
                <td>{coupon.code}</td>
                <td>₹{coupon.discount}</td>
                <td>{coupon.products.length}</td>
                <td>
                  <button className="edit-btn" onClick={() => onEdit(coupon)}>
                    Edit
                  </button>
                  <button className="delete-btn" onClick={() => onDelete(coupon._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CouponList;
