// LineChart.jsx - Professional UI matching admin dashboard style
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Skeleton } from '@/Components/ui/skeleton';
import { TrendingUp, Users, ShoppingBag, PackageCheck } from 'lucide-react';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const LineChart = ({ data, isLoading = false, onRefresh }) => {
  const {
    chartData,
    stockChartData,
    orderChartData,
    userAdminData,
    userMonthlyData,
    userAgeData,
  } = data || {};

  // Common Chart.js options for professional line charts
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
          display: true,
          color: '#f3f4f6', // Tailwind gray-100
          drawBorder: false,
        },
        ticks: { 
          color: '#6b7280', // Tailwind gray-500
          font: { size: 12, family: "'Inter', sans-serif" },
          maxRotation: 45,
          minRotation: 0,
        },
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
      duration: 1500,
      easing: 'easeOutQuart',
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
    elements: {
      point: {
        radius: 4,
        hoverRadius: 6,
      },
      line: {
        borderWidth: 3,
        tension: 0.4, // Slight curve for professional look
      },
    },
  };

  // Chart configurations with professional titles and icons
  const charts = [
    {
      title: 'Monthly User Growth Trend',
      data: userMonthlyData,
      show: userMonthlyData?.labels?.length > 0,
      height: 'h-80',
      description: 'New user registrations over the last 6 months',
      icon: Users,
    },
    {
      title: 'Stock Level Trends',
      data: chartData,
      show: chartData?.labels?.length > 0,
      height: 'h-72',
      description: 'Stock distribution trends by category',
      icon: ShoppingBag,
    },
    {
      title: 'Order Volume Over Time',
      data: orderChartData,
      show: orderChartData?.labels?.length > 0,
      height: 'h-72',
      description: 'Order processing trends by status',
      icon: PackageCheck,
    },
    {
      title: 'User Engagement Metrics',
      data: userAdminData,
      show: userAdminData?.labels?.length > 0,
      height: 'h-72',
      description: 'User vs admin activity comparison',
      icon: TrendingUp,
    },
    {
      title: 'Age Group Engagement',
      data: userAgeData,
      show: userAgeData?.labels?.length > 0,
      height: 'h-72',
      description: 'User demographics and engagement by age',
      icon: Users,
    },
    {
      title: 'Inventory Health Monitor',
      data: stockChartData,
      show: stockChartData?.labels?.length > 0,
      height: 'h-72',
      description: 'In-stock vs out-of-stock product trends',
      icon: ShoppingBag,
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="shadow-sm">
            <CardHeader className="pb-3">
              <Skeleton className="h-6 w-64" />
              <Skeleton className="h-4 w-48 mt-2" />
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
                <div className="flex items-center gap-3">
                  <chart.icon className="h-5 w-5 text-blue-600" />
                  <div>
                    <CardTitle className="text-lg font-semibold text-gray-900">
                      {chart.title}
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{chart.description}</p>
                  </div>
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
                <Line
                  data={chart.data}
                  options={{
                    ...chartOptions,
                    plugins: {
                      ...chartOptions.plugins,
                      legend: {
                        ...chartOptions.plugins.legend,
                        display: chart.data.datasets[0].data.length <= 6, // Show legend for fewer data points
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
            <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Analytics Data</h3>
            <p className="text-sm text-gray-600">Charts will display once data is available. Try refreshing.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LineChart;