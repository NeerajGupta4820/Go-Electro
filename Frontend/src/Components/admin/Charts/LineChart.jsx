import { Line } from "react-chartjs-2"; 
import {Chart as ChartJS,LineElement,PointElement,CategoryScale,LinearScale,Title,Tooltip,Legend,} from "chart.js";
import "./chart.css";
ChartJS.register(LineElement,PointElement,CategoryScale,LinearScale,Title,Tooltip,Legend);

const LineChart = ({ data }) => {
  const {chartData,stockChartData,orderChartData,userAdminData,userMonthlyData,userAgeData,} = data;
  console.log(chartData);

  return (
    <div className="chart-container">
      {chartData.labels && (
        <div className="chart-section">
          <h3>Stock Distribution per Category</h3>
          <Line data={chartData} />
        </div>
      )}

      {stockChartData.labels && (
        <div className="chart-section">
          <h3>Stock Status (In vs Out of Stock)</h3>
          <Line data={stockChartData} />
        </div>
      )}

      {orderChartData.labels && (
        <div className="chart-section">
          <h3>Order Status (Processing, Shipped, Delivered)</h3>
          <Line data={orderChartData} />
        </div>
      )}

      {userAdminData.labels && (
        <div className="chart-section">
          <h3>User vs Admin</h3>
          <Line data={userAdminData} />
        </div>
      )}

      {userMonthlyData.labels && (
        <div className="chart-section">
          <h3>New Users per Month</h3>
          <Line data={userMonthlyData} />
        </div>
      )}

      {userAgeData.labels && (
        <div className="chart-section">
          <h3>Users by Age Group</h3>
          <Line data={userAgeData} />
        </div>
      )}
    </div>
  );
};

export default LineChart;
