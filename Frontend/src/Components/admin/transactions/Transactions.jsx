import { useState, useEffect } from "react";
import { useGetAllOrdersQuery, useUpdateOrderStatusMutation } from "../../../redux/api/orderAPI";
import Loader from "../../../Components/Loader/Loader";
import "./Transactions.css";

const AdminTransactions = () => {
  const { data, error, isLoading, refetch } = useGetAllOrdersQuery();
  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [orders, setOrders] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    if (data && orders.length === 0) {
      setOrders(Array.isArray(data) ? data : data?.orders || []);
    }
  }, [data, orders.length]);

  if (isLoading) return <Loader type="page" size="large" />;
  if (error) return <p>Failed to load orders: {error.message}</p>;

  const openPopup = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
  };

  const closePopup = () => {
    setSelectedOrder(null);
    setShowConfirmation(false);
  };

  const confirmStatusChange = () => {
    if (newStatus === "Delivered" && selectedOrder.status !== "Delivered") {
      setShowConfirmation(true);
    } else {
      handleChangeStatus();
    }
  };

  const handleChangeStatus = async () => {
    if (selectedOrder) {
      const updatedOrders = orders.map((order) => {
        if (order._id === selectedOrder._id) {
          return { ...order, status: newStatus };
        }
        return order;
      });
      setOrders(updatedOrders);

      await updateOrderStatus({ id: selectedOrder._id, status: newStatus });
      refetch(); // Refetch data to reflect changes
      closePopup();
    }
  };

  return (
    <div className="Transactions-orders">
      <h2>Your Orders</h2>
      {orders.length === 0 ? (
        <p>You have no orders.</p>
      ) : (
        <table className="Transactions-orders-table">
          <thead>
            <tr>
              <th>Photos</th>
              <th>Date</th>
              <th>Status</th>
              <th>Total</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Manage</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) =>
              order.orderItems.map((item, index) => (
                <tr key={`${order._id}-${item.productId}`}>
                  <td>
                    <div className="Transactions-order-item">
                      <img src={item.photo} alt={item.name} />
                      <span>{item.name}</span>
                    </div>
                  </td>
                  {index === 0 && (
                    <>
                      <td rowSpan={order.orderItems.length}>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td rowSpan={order.orderItems.length}>{order.status}</td>
                      <td rowSpan={order.orderItems.length}>Rs.{order.total.toFixed(2)}</td>
                    </>
                  )}
                  <td>Rs.{item.price.toFixed(2)}</td>
                  <td>{item.quantity}</td>
                  {index === 0 && (
                    <td rowSpan={order.orderItems.length}>
                      <button onClick={() => openPopup(order)} className="Transactions-view-order-details">
                        View Details
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {selectedOrder && (
        <div className="Transaction-popup-overlay">
          <div className="Transaction-popup-content">
            <button onClick={closePopup} className="close-button">×</button>
            <h3>Order Details</h3>
            <p><strong>Order ID:</strong> {selectedOrder._id}</p>
            <p><strong>Date:</strong> {new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
            <p><strong>Total:</strong> Rs.{selectedOrder.total.toFixed(2)}</p>
            <p><strong>Status:</strong> {selectedOrder.status}</p>

            <h4>Items:</h4>
            <ul>
              {selectedOrder.orderItems.map((item) => (
                <li key={item.productId}>
                  {item.name} - Qty: {item.quantity} - Rs.{item.price.toFixed(2)}
                </li>
              ))}
            </ul>

            <div className="status-update">
              <label>Status:</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                disabled={selectedOrder.status === "Delivered"}
              >
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
              </select>
              <button onClick={confirmStatusChange} className="change-status-button" disabled={selectedOrder.status === "Delivered"}>
                Change
              </button>
            </div>

            {showConfirmation && (
              <div className="confirmation-Transaction-popup">
                <p>Are you sure you want to mark this order as &quot;Delivered&quot;? This action cannot be undone.</p>
                <button onClick={handleChangeStatus} className="confirm-button">Yes, Confirm</button>
                <button onClick={() => setShowConfirmation(false)} className="cancel-button">Cancel</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTransactions;
