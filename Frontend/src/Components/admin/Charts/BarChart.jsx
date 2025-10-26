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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const BarChart = ({ data }) => {
  const {
    chartData,
    stockChartData,
    orderChartData,
    userAdminData,
    userMonthlyData,
    userAgeData,
  } = data;

  // Common Chart.js options for all charts
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: 14,
            family: "'Inter', sans-serif",
          },
          color: "#1f2937", // Tailwind gray-800
        },
      },
      title: {
        display: true,
        font: {
          size: 18,
          family: "'Inter', sans-serif",
          weight: "bold",
        },
        color: "#1f2937", // Tailwind gray-800
      },
      tooltip: {
        backgroundColor: "#1f2937", // Tailwind gray-800
        titleFont: { size: 14, family: "'Inter', sans-serif" },
        bodyFont: { size: 12, family: "'Inter', sans-serif" },
        padding: 12,
        cornerRadius: 6,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#4b5563" }, // Tailwind gray-600
      },
      y: {
        grid: { color: "#e5e7eb" }, // Tailwind gray-200
        ticks: { color: "#4b5563" }, // Tailwind gray-600
      },
    },
  };

  // Chart-specific configurations
  const charts = [
    {
      title: "Stock Distribution per Category",
      data: chartData,
      show: chartData.labels,
    },
    {
      title: "In Stock vs Out of Stock",
      data: stockChartData,
      show: stockChartData.labels,
    },
    {
      title: "Order Status Distribution",
      data: orderChartData,
      show: orderChartData.labels,
    },
    {
      title: "User vs Admin Count",
      data: userAdminData,
      show: userAdminData.labels,
    },
    {
      title: "New Users in Last 6 Months",
      data: userMonthlyData,
      show: userMonthlyData.labels,
    },
    {
      title: "User Age Group Distribution",
      data: userAgeData,
      show: userAgeData.labels,
    },
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      {charts.map((chart, index) =>
        chart.show ? (
          <Card key={index} className="w-full max-w-4xl mx-auto shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-800">
                {chart.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <Bar
                  data={chart.data}
                  options={{
                    ...chartOptions,
                    plugins: {
                      ...chartOptions.plugins,
                      title: {
                        ...chartOptions.plugins.title,
                        text: chart.title,
                      },
                    },
                  }}
                />
              </div>
            </CardContent>
          </Card>
        ) : null
      )}
    </div>
  );
};

export default BarChart;