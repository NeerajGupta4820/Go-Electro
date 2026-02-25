// BarChart.jsx - Fixed import for BarChart3 icon
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Skeleton } from '@/Components/ui/skeleton';
import { RefreshCw, BarChart3 } from 'lucide-react'; // Added BarChart3 import

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const BarChart = ({ data, isLoading = false, onRefresh }) => {
  const {
    chartData,
    stockChartData,
    orderChartData,
    userAdminData,
    userMonthlyData,
    userAgeData,
  } = data || {};

  // Common Chart.js options for professional look
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 13,
            family: "'Inter', sans-serif",
            weight: '500',
          },
          color: '#374151', // Tailwind gray-700
          padding: 20,
          usePointStyle: true,
        },
      },
      title: {
        display: false, // Handled by CardTitle
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.95)', // Tailwind gray-900
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        titleFont: { size: 14, family: "'Inter', sans-serif", weight: '600' },
        bodyFont: { size: 13, family: "'Inter', sans-serif" },
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          title: (context) => context[0].label,
          label: (context) => `${context.dataset.label}: ${context.parsed.y.toLocaleString()}`,
        },
      },
    },
    scales: {
      x: {
        grid: { 
          display: false,
          drawBorder: false,
        },
        ticks: { 
          color: '#6b7280', // Tailwind gray-500
          font: { size: 12, family: "'Inter', sans-serif" },
          maxRotation: 45,
          minRotation: 0,
        },
        gridLines: { display: false },
      },
      y: {
        grid: { 
          color: '#e5e7eb', // Tailwind gray-200
          drawBorder: false,
        },
        ticks: { 
          color: '#6b7280', // Tailwind gray-500
          font: { size: 12, family: "'Inter', sans-serif" },
          callback: (value) => value.toLocaleString(),
        },
        beginAtZero: true,
      },
    },
    animation: {
      duration: 1000,
      easing: 'easeOutQuart',
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
  };

  // Chart configurations with professional titles
  const charts = [
    {
      title: 'Stock Distribution by Category',
      data: chartData,
      show: chartData?.labels?.length > 0,
      height: 'h-80',
      description: 'Total stock quantity across product categories',
    },
    {
      title: 'Inventory Status Overview',
      data: stockChartData,
      show: stockChartData?.labels?.length > 0,
      height: 'h-72',
      description: 'Products available vs out of stock',
    },
    {
      title: 'Order Status Breakdown',
      data: orderChartData,
      show: orderChartData?.labels?.length > 0,
      height: 'h-72',
      description: 'Distribution of orders by processing stage',
    },
    {
      title: 'User Role Distribution',
      data: userAdminData,
      show: userAdminData?.labels?.length > 0,
      height: 'h-72',
      description: 'Platform users vs administrators',
    },
    {
      title: 'Monthly User Growth',
      data: userMonthlyData,
      show: userMonthlyData?.labels?.length > 0,
      height: 'h-80',
      description: 'New user registrations over the last 6 months',
    },
    {
      title: 'User Demographics by Age Group',
      data: userAgeData,
      show: userAgeData?.labels?.length > 0,
      height: 'h-72',
      description: 'Customer distribution across age segments',
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="shadow-sm">
            <CardHeader className="pb-3">
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {charts.map((chart, index) =>
        chart.show ? (
          <Card key={index} className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    {chart.title}
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">{chart.description}</p>
                </div>
                {onRefresh && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onRefresh}
                    className="h-8 w-8 p-0"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className={chart.height}>
                <Bar
                  data={chart.data}
                  options={{
                    ...chartOptions,
                    plugins: {
                      ...chartOptions.plugins,
                      legend: {
                        ...chartOptions.plugins.legend,
                        display: chart.data.datasets[0].data.length <= 4, // Hide legend for many categories
                      },
                    },
                  }}
                />
              </div>
            </CardContent>
          </Card>
        ) : null
      )}
      
      {charts.every(chart => !chart.show) && (
        <Card className="shadow-sm">
          <CardContent className="p-12 text-center">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Available</h3>
            <p className="text-sm text-gray-600">Analytics data will appear here once available.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BarChart;