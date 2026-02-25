// PieChart.jsx - Fixed naming conflict
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Skeleton } from '@/Components/ui/skeleton';
import { RefreshCw, PieChart as PieChartIcon, ShoppingBag, PackageCheck, Users, Calendar } from 'lucide-react'; // Renamed PieChart to PieChartIcon

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ data, isLoading = false, onRefresh }) => {
  const {
    chartData,
    stockChartData,
    orderChartData,
    userAdminData,
    userMonthlyData,
    userAgeData,
  } = data || {};

  // Common Chart.js options for professional pie charts
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          font: {
            size: 12,
            family: "'Inter', sans-serif",
            weight: '500',
          },
          color: '#374151', // Tailwind gray-700
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
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
          label: (context) => `${context.label}: ${context.parsed.toLocaleString()}`,
        },
      },
    },
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1200,
      easing: 'easeOutQuart',
    },
    cutout: '50%', // Donut style for better look
  };

  // Chart configurations with professional titles and icons
  const charts = [
    {
      title: 'Stock Distribution by Category',
      data: chartData,
      show: chartData?.labels?.length > 0,
      height: 'h-72',
      description: 'Product stock allocation across categories',
      icon: ShoppingBag,
    },
    {
      title: 'Inventory Health Overview',
      data: stockChartData,
      show: stockChartData?.labels?.length > 0,
      height: 'h-64',
      description: 'Available vs unavailable inventory',
      icon: ShoppingBag,
    },
    {
      title: 'Order Processing Pipeline',
      data: orderChartData,
      show: orderChartData?.labels?.length > 0,
      height: 'h-64',
      description: 'Orders at each fulfillment stage',
      icon: PackageCheck,
    },
    {
      title: 'Platform User Composition',
      data: userAdminData,
      show: userAdminData?.labels?.length > 0,
      height: 'h-64',
      description: 'Distribution between regular users and administrators',
      icon: Users,
    },
    {
      title: 'User Age Demographics',
      data: userAgeData,
      show: userAgeData?.labels?.length > 0,
      height: 'h-64',
      description: 'Customer base segmented by age groups',
      icon: Users,
    },
    {
      title: 'Monthly Registration Trends',
      data: userMonthlyData,
      show: userMonthlyData?.labels?.length > 0,
      height: 'h-64',
      description: 'New user signups over recent months',
      icon: Calendar,
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
              <Skeleton className="h-64 w-full rounded-full mx-auto" />
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
                  <chart.icon className="h-5 w-5 text-indigo-600" />
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
                <Pie
                  data={chart.data}
                  options={{
                    ...chartOptions,
                    plugins: {
                      ...chartOptions.plugins,
                      legend: {
                        ...chartOptions.plugins.legend,
                        display: chart.data.labels.length <= 6, // Show legend for fewer segments
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
            <PieChartIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Analytics Data</h3>
            <p className="text-sm text-gray-600">Pie charts will display once data is available.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PieChart;