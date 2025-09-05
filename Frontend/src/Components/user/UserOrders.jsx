import { useSelector } from "react-redux";
import { useGetOrdersByUserQuery } from "../../redux/api/orderAPI";
import "./UserOrders.css";

const UserOrders = () => {
  const user = useSelector((state) => state.user.user);
  const userId = user?._id;

  const { data, error, isLoading } = useGetOrdersByUserQuery(userId);

  if (isLoading) return <p>Loading orders...</p>;
  if (error) return <p>Failed to load orders: {error.message}</p>;

  const orders = Array.isArray(data) ? data : data?.orders || [];

  return (
    <div className="user-orders">
      <h2>Your Orders</h2>
      {orders.length === 0 ? (
        <p>You have no orders.</p>
      ) : (
        <table className="orders-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Total</th>
              <th>Status</th>
              <th>Item</th>
              <th>Quantity</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              order.orderItems.map((item, index) => (
                <tr key={`Rs.{order._id}-Rs.{item.productId}`}>
                  {index === 0 && (
                    <>
                      <td rowSpan={order.orderItems.length}>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td rowSpan={order.orderItems.length}>Rs.{order.total.toFixed(2)}</td>
                      <td rowSpan={order.orderItems.length}>{order.status}</td>
                    </>
                  )}
                  <td>
                    <div className="order-item">
                      <img src={item.photo} alt={item.name} />
                      <span>{item.name}</span>
                    </div>
                  </td>
                  <td>{item.quantity}</td>
                  <td>Rs.{item.price.toFixed(2)}</td>
                </tr>
              ))
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserOrders;
