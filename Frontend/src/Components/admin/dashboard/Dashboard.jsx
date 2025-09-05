import "./Dashboard.css";
import { useEffect } from "react";
import { useGetAllProductsQuery } from '../../../redux/api/productAPI';
import { useFetchAllCategoriesQuery } from '../../../redux/api/categoryAPI'; 
import { useAllUsersMutation } from '../../../redux/api/userAPI'; 
import { useGetAllOrdersQuery } from '../../../redux/api/orderAPI'; 
import Loader from '../../../Components/Loader/Loader';

const Dashboard = () => {
  const { data: productsData, isLoading: productsLoading, error: productsError } = useGetAllProductsQuery();
  const { data: categoriesResponse, isLoading: categoriesLoading, error: categoriesError } = useFetchAllCategoriesQuery(); 
  const [fetchAllUsers, { data: usersData, isLoading: usersLoading }] = useAllUsersMutation();
  const { data: ordersData, isLoading: ordersLoading } = useGetAllOrdersQuery(); 

  useEffect(() => {
    fetchAllUsers(); 
  }, [fetchAllUsers]);

  const productsArray = productsData?.products || [];
  const totalProductsQuantity = productsArray.length || 0;
  const totalCategoriesQuantity = categoriesResponse?.data?.length || 0;
  const totalUsersQuantity = usersData?.success ? usersData.users.length : 0;

  const deliveredOrders = ordersData?.orders?.filter(order => order.status === 'Delivered') || [];

  const productQuantities = {};

  deliveredOrders.forEach(order => {
    order.orderItems.forEach(item => {
      const productId = item.productId; 
      const quantity = item.quantity;
      if (productQuantities[productId]) {
        productQuantities[productId].quantity += quantity;
      } else {
        productQuantities[productId] = {
          name: item.name,
          photo: item.photo,
          quantity: quantity,
        };
      }
    });
  });

  const topProductsArray = Object.values(productQuantities)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 10); 
  
  const subtotal = deliveredOrders.reduce((acc, order) => acc + order.subtotal, 0);
  const revenue = deliveredOrders.reduce((acc, order) => acc + order.total, 0);
  
  const topTransactions = deliveredOrders
    .sort((a, b) => b.subtotal - a.subtotal)
    .slice(0, 10);
    console.log(topTransactions)

  const headerData = [
    { label: "Total Users", value: usersLoading ? <Loader type="data" /> : totalUsersQuantity, percentage: 75 },
    { label: "Total Products", value: productsLoading ? <Loader type="data" /> : totalProductsQuantity, percentage: 90 },
    { label: "Total Categories", value: categoriesLoading ? <Loader type="data" /> : totalCategoriesQuantity, percentage: 100 },
    { label: "Total Sale", value: `Rs.${subtotal.toFixed(2)}`, percentage: 60 },
    { label: "Revenue", value: `Rs.${revenue.toFixed(2)}`, percentage: 95 },
  ];

  return (
    <div className="main-dashboard">
      <div className="dashboard-header">
        {headerData.map((item, index) => (
          <div className="dashboard-header-cards" key={index}>
            <h4>{item.label}</h4>
            <div>{item.value}</div>
            <div className="percentage-circle">
              <div
                className="circle"
                style={{
                  background: `conic-gradient(#4caf50 ${item.percentage * 3.6}deg, #ddd 0deg)`,
                }}
              ></div>
              <p className="percentage-value">{item.percentage}%</p>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-inventory">
        <div className="dashboard-mostsaleProducts">
          <h4>Top Products Sold</h4>
          <table className="top-products-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Quantity Sold</th>
              </tr>
            </thead>
            <tbody>
              {topProductsArray.map((product, index) => (
                <tr key={index}>
                  <td>{product.name}</td>
                  <td>{product.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="dashboard-products-inventory">
          <h4>Product Inventory</h4>
          {productsLoading ? (
            <Loader type="data" />
          ) : productsError ? (
            <p>Error loading products</p>
          ) : (
            <div className="products-list-section" style={{ height: '300px', overflowY: 'auto' }}>
              {productsArray.slice(0, 10).map((product, index) => (
                <div key={index} className="product-item">
                  <span className="product-name">{product.title}</span>
                  <div
                    className="product-quantity-line"
                    style={{
                      width: `${(product.stock / Math.max(...productsArray.map((p) => p.stock ?? 0))) * 100}%`,
                      backgroundColor:
                        product.stock > 700
                          ? "#ff5733"
                          : product.stock > 400
                          ? "#fbc02d"
                          : "#4caf50",
                    }}
                    title={`Stock: ${product.stock}`}
                  ></div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="dashboard-category-inventory">
          <h4>Category Inventory</h4>
          {categoriesLoading ? (
            <Loader type="data" />
          ) : categoriesError ? (
            <p>Error loading categories</p>
          ) : (
            <div className="category-list-section" style={{ height: '300px', overflowY: 'auto' }}>
              {Array.isArray(categoriesResponse?.data) ? (
                categoriesResponse.data.map((category, index) => (
                  <div key={index} className="category-item">
                    <h5>{category.name}</h5>
                  </div>
                ))
              ) : (
                <p>No categories available.</p>
              )}
            </div>
          )}
        </div>
      </div>
      
      <div className="dashboard-top-transactions">
        <h4>Top Transactions</h4>
        {ordersLoading ? (
          <Loader type="data" />
        ) : (
          <table className="top-transactions-table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {topTransactions.length > 0 ? (
                topTransactions.map((transaction, index) => (
                  <tr key={index}>
                    <td>{transaction._id}</td>
                    <td>neeraj</td>
                    <td>Rs.{transaction.subtotal.toFixed(2)}</td>
                    <td>{new Date(transaction.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No delivered transactions available.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
