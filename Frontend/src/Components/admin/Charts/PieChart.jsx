import React from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  Tooltip,
  Legend,
} from "chart.js"; 

ChartJS.register(ArcElement, CategoryScale, Tooltip, Legend);

const PieChart = ({ data }) => {
  const {
    chartData,
    stockChartData,
    orderChartData,
    userAdminData,
    userMonthlyData,
    userAgeData,
  } = data;

  return (
    <div className="chart-container">
      {/* Stock Distribution per Category Pie Chart */}
      {chartData.labels && (
        <div className="chart-section">
          <h3>Stock Distribution per Category</h3>
          <Pie data={chartData} />
        </div>
      )}

      {/* Stock Status Pie Chart */}
      {stockChartData.labels && (
        <div className="chart-section">
          <h3>Stock Status (In vs Out of Stock)</h3>
          <Pie data={stockChartData} />
        </div>
      )}

      {/* Order Status Pie Chart */}
      {orderChartData.labels && (
        <div className="chart-section">
          <h3>Order Status (Processing, Shipped, Delivered)</h3>
          <Pie data={orderChartData} />
        </div>
      )}

      {/* User vs Admin Pie Chart */}
      {userAdminData.labels && (
        <div className="chart-section">
          <h3>User vs Admin</h3>
          <Pie data={userAdminData} />
        </div>
      )}

      {/* User Age Group Pie Chart */}
      {userAgeData.labels && (
        <div className="chart-section">
          <h3>Users by Age Group</h3>
          <Pie data={userAgeData} />
        </div>
      )}

      {/* New Users per Month Pie Chart */}
      {userMonthlyData.labels && (
        <div className="chart-section">
          <h3>New Users per Month</h3>
          <Pie data={userMonthlyData} />
        </div>
      )}
    </div>
  );
};

export default PieChart;
