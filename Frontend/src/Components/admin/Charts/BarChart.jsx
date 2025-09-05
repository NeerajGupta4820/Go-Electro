import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const BarChart = ({ data }) => {
  const {
    chartData,
    stockChartData,
    orderChartData,
    userAdminData,
    userMonthlyData,
    userAgeData,
  } = data;

  return (
    <div style={{ width: "80%", margin: "auto", padding: "20px" }}>
      {/* Stock Distribution per Category Chart */}
      {chartData.labels && (
        <div style={{ marginBottom: "40px" }}>
          <h3
            style={{ textAlign: "center", marginBottom: "20px", color: "#333" }}
          >
            Stock Distribution per Category
          </h3>
          <Bar
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "top" },
                title: {
                  display: true,
                  text: "Stock Distribution per Category",
                  font: {
                    size: 18,
                    family: "'Arial', sans-serif",
                    weight: "bold",
                  },
                },
              },
            }}
          />
        </div>
      )}

      {/* In Stock vs Out of Stock Chart */}
      {stockChartData.labels && (
        <div style={{ marginBottom: "40px" }}>
          <h3
            style={{ textAlign: "center", marginBottom: "20px", color: "#333" }}
          >
            In Stock vs Out of Stock
          </h3>
          <Bar
            data={stockChartData}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "top" },
                title: {
                  display: true,
                  text: "In Stock vs Out of Stock",
                  font: {
                    size: 18,
                    family: "'Arial', sans-serif",
                    weight: "bold",
                  },
                },
              },
            }}
          />
        </div>
      )}

      {/* Order Status Distribution Chart */}
      {orderChartData.labels && (
        <div style={{ marginBottom: "40px" }}>
          <h3
            style={{ textAlign: "center", marginBottom: "20px", color: "#333" }}
          >
            Order Status Distribution
          </h3>
          <Bar
            data={orderChartData}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "top" },
                title: {
                  display: true,
                  text: "Order Status Distribution",
                  font: {
                    size: 18,
                    family: "'Arial', sans-serif",
                    weight: "bold",
                  },
                },
              },
            }}
          />
        </div>
      )}

      {/* User vs Admin Count Chart */}
      {userAdminData.labels && (
        <div style={{ marginBottom: "40px" }}>
          <h3
            style={{ textAlign: "center", marginBottom: "20px", color: "#333" }}
          >
            User vs Admin Count
          </h3>
          <Bar
            data={userAdminData}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "top" },
                title: {
                  display: true,
                  text: "User vs Admin Count",
                  font: {
                    size: 18,
                    family: "'Arial', sans-serif",
                    weight: "bold",
                  },
                },
              },
            }}
          />
        </div>
      )}

      {/* New Users in Last 6 Months Chart */}
      {userMonthlyData.labels && (
        <div style={{ marginBottom: "40px" }}>
          <h3
            style={{ textAlign: "center", marginBottom: "20px", color: "#333" }}
          >
            New Users in Last 6 Months
          </h3>
          <Bar
            data={userMonthlyData}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "top" },
                title: {
                  display: true,
                  text: "New Users in Last 6 Months",
                  font: {
                    size: 18,
                    family: "'Arial', sans-serif",
                    weight: "bold",
                  },
                },
              },
            }}
          />
        </div>
      )}

      {/* User Age Group Distribution Chart */}
      {userAgeData.labels && (
        <div style={{ marginBottom: "40px" }}>
          <h3
            style={{ textAlign: "center", marginBottom: "20px", color: "#333" }}
          >
            User Age Group Distribution
          </h3>
          <Bar
            data={userAgeData}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "top" },
                title: {
                  display: true,
                  text: "User Age Group Distribution",
                  font: {
                    size: 18,
                    family: "'Arial', sans-serif",
                    weight: "bold",
                  },
                },
              },
            }}
          />
        </div>
      )}
    </div>
  );
};

export default BarChart;
