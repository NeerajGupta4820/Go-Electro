// Chart.jsx - Professional UI matching other admin pages with console logging
import { useEffect, useState } from 'react';
import BarChart from './BarChart';
import PieChart from './PieChart';
import LineChart from './LineChart';
import {
  useGetOrderMutation,
  useGetProductMutation,
  useGetUsersMutation,
} from '../../../redux/api/chartAPI';
import { Button } from '@/Components/ui/button';
import { Card, CardContent} from '@/Components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/Components/ui/tabs';
import dayjs from 'dayjs';
import { RefreshCw, BarChart3, PieChartIcon, TrendingUp } from 'lucide-react';
import { toast } from 'react-toastify';

const Chart = () => {
  const getRandomColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    const a = (Math.random() * 0.5 + 0.4).toFixed(2);
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  };

  const [getProduct, { isLoading, error }] = useGetProductMutation();
  const [getOrder] = useGetOrderMutation();
  const [getUser] = useGetUsersMutation();
  const [chartData, setChartData] = useState({});
  const [stockChartData, setStockChartData] = useState({});
  const [orderChartData, setOrderChartData] = useState({});
  const [userAdminData, setUserAdminData] = useState({});
  const [userMonthlyData, setUserMonthlyData] = useState({});
  const [userAgeData, setUserAgeData] = useState({});
  const [toDisplay, setToDisplay] = useState('Bar');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productResult, orderResult, userResult] = await Promise.all([
          getProduct().unwrap(),
          getOrder().unwrap(),
          getUser().unwrap(),
        ]);

        // Console logging for backend data
        console.log('🔍 Backend Data - Products:', productResult.Products || []);
        console.log('🔍 Backend Data - Orders:', orderResult.orders || []);
        console.log('🔍 Backend Data - Users:', userResult.users || []);

        processChartData(productResult.Products);
        processStockChartData(productResult.Products);
        processOrderStatusData(orderResult.orders);
        processUserAdminData(userResult.users);
        processUserMonthlyData(userResult.users);
        processUserAgeData(userResult.users);
      } catch (err) {
        console.error('❌ Error fetching chart data:', err);
        toast.error('Failed to load analytics data. Please try again.');
      }
    };

    fetchData();
  }, [getProduct, getOrder, getUser]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch(); // Assuming refetch is available; adjust if needed
      toast.success('Analytics refreshed successfully!');
    } catch (err) {
      toast.error('Failed to refresh data.');
    } finally {
      setIsRefreshing(false);
    }
  };

  const processOrderStatusData = (orders) => {
    let processingCount = 0;
    let shippedCount = 0;
    let deliveredCount = 0;

    orders?.forEach((order) => {
      switch (order.status) {
        case 'Processing':
          processingCount += 1;
          break;
        case 'Shipped':
          shippedCount += 1;
          break;
        case 'Delivered':
          deliveredCount += 1;
          break;
        default:
          break;
      }
    });

    console.log('📊 Processed Order Status Data:', { processingCount, shippedCount, deliveredCount });

    setOrderChartData({
      labels: ['Processing', 'Shipped', 'Delivered'],
      datasets: [
        {
          label: 'Order Status',
          data: [processingCount, shippedCount, deliveredCount],
          backgroundColor: [
            'rgba(255, 193, 7, 0.6)',   // Yellow for Processing
            'rgba(52, 152, 219, 0.6)',  // Blue for Shipped
            'rgba(46, 204, 113, 0.6)',  // Green for Delivered
          ],
          borderColor: [
            'rgba(255, 193, 7, 1)',
            'rgba(52, 152, 219, 1)',
            'rgba(46, 204, 113, 1)',
          ],
          borderWidth: 2,
        },
      ],
    });
  };

  const processChartData = (products) => {
    const categoryMap = {};

    products?.forEach((item) => {
      const categoryName = item.category?.name || 'Uncategorized';
      categoryMap[categoryName] = (categoryMap[categoryName] || 0) + item.stock;
    });

    const labels = Object.keys(categoryMap);
    const stockData = Object.values(categoryMap);

    console.log('📊 Processed Category Stock Data:', { labels, stockData });

    setChartData({
      labels,
      datasets: [
        {
          label: 'Stock per Category',
          data: stockData,
          backgroundColor: labels.map(() => getRandomColor()),
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 2,
        },
      ],
    });
  };

  const processStockChartData = (products) => {
    let inStockCount = 0;
    let outOfStockCount = 0;

    products?.forEach((item) => {
      if (item.stock > 0) {
        inStockCount += 1;
      } else {
        outOfStockCount += 1;
      }
    });

    console.log('📊 Processed Stock Status Data:', { inStockCount, outOfStockCount });

    setStockChartData({
      labels: ['In Stock', 'Out of Stock'],
      datasets: [
        {
          label: 'Stock Status',
          data: [inStockCount, outOfStockCount],
          backgroundColor: [
            'rgba(46, 204, 113, 0.6)',  // Green for In Stock
            'rgba(231, 76, 60, 0.6)',   // Red for Out of Stock
          ],
          borderColor: [
            'rgba(46, 204, 113, 1)',
            'rgba(231, 76, 60, 1)',
          ],
          borderWidth: 2,
        },
      ],
    });
  };

  const processUserAdminData = (users) => {
    let userCount = 0;
    let adminCount = 0;

    users?.forEach((user) => {
      if (user.role === 'user') userCount += 1;
      if (user.role === 'admin') adminCount += 1;
    });

    console.log('📊 Processed User vs Admin Data:', { userCount, adminCount });

    setUserAdminData({
      labels: ['Users', 'Admins'],
      datasets: [
        {
          label: 'User vs Admin',
          data: [userCount, adminCount],
          backgroundColor: [
            'rgba(52, 152, 219, 0.6)',  // Blue for Users
            'rgba(155, 89, 182, 0.6)',  // Purple for Admins
          ],
          borderColor: [
            'rgba(52, 152, 219, 1)',
            'rgba(155, 89, 182, 1)',
          ],
          borderWidth: 2,
        },
      ],
    });
  };

  const processUserMonthlyData = (users) => {
    const monthlyCount = Array(6).fill(0);
    const labels = [];

    for (let i = 5; i >= 0; i--) {
      const month = dayjs().subtract(i, 'month').format('MMM YYYY');
      labels.push(month);
    }

    users?.forEach((user) => {
      const userMonth = dayjs(user.createdAt).format('MMM YYYY');
      const monthIndex = labels.indexOf(userMonth);
      if (monthIndex >= 0) monthlyCount[monthIndex] += 1;
    });

    console.log('📊 Processed Monthly User Data:', { labels, monthlyCount });

    setUserMonthlyData({
      labels,
      datasets: [
        {
          label: 'New Users per Month',
          data: monthlyCount,
          backgroundColor: 'rgba(52, 152, 219, 0.6)',
          borderColor: 'rgba(52, 152, 219, 1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
        },
      ],
    });
  };

  const processUserAgeData = (users) => {
    let ageGroup1 = 0; // 18-25
    let ageGroup2 = 0; // 26-35
    let ageGroup3 = 0; // 36-45
    let ageGroup4 = 0; // 46+

    users?.forEach((user) => {
      if (user.age >= 18 && user.age <= 25) ageGroup1 += 1;
      else if (user.age >= 26 && user.age <= 35) ageGroup2 += 1;
      else if (user.age >= 36 && user.age <= 45) ageGroup3 += 1;
      else if (user.age >= 46) ageGroup4 += 1;
    });

    console.log('📊 Processed User Age Data:', { ageGroup1, ageGroup2, ageGroup3, ageGroup4 });

    setUserAgeData({
      labels: ['18-25', '26-35', '36-45', '46+'],
      datasets: [
        {
          label: 'User Age Groups',
          data: [ageGroup1, ageGroup2, ageGroup3, ageGroup4],
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',    // Pink
            'rgba(54, 162, 235, 0.6)',    // Blue
            'rgba(255, 206, 86, 0.6)',    // Yellow
            'rgba(75, 192, 192, 0.6)',    // Teal
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
          ],
          borderWidth: 2,
        },
      ],
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-600" />
          <p className="text-xl text-gray-600">Loading Analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-600 mb-4">Error loading analytics data.</p>
          <Button onClick={() => window.location.reload()} className="bg-blue-600 hover:bg-blue-700 text-white">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const chartDataProps = {
    chartData,
    stockChartData,
    orderChartData,
    userAdminData,
    userMonthlyData,
    userAgeData,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto max-w-6xl p-4 md:p-6 space-y-6">
        {/* === MAIN HEADER CONTAINER === */}
        <Card className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-gray-600 mt-1">Monitor your e-commerce performance with interactive charts</p>
            </div>
            <div className="flex-shrink-0">
              <Button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="bg-blue-600 hover:bg-blue-700 text-white whitespace-nowrap"
                size="lg"
              >
                {isRefreshing ? (
                  <>
                    <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                    Refreshing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-5 w-5" />
                    Refresh Data
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* === CHART TABS === */}
          <Tabs
            defaultValue="Bar"
            value={toDisplay}
            onValueChange={setToDisplay}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3 gap-2 mb-6 bg-gray-50 p-1 rounded-lg">
              <TabsTrigger 
                value="Bar" 
                className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm rounded-md"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Bar Chart
              </TabsTrigger>
              <TabsTrigger 
                value="Pie" 
                className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm rounded-md"
              >
                <PieChartIcon className="h-4 w-4 mr-2" />
                Pie Chart
              </TabsTrigger>
              <TabsTrigger 
                value="Line" 
                className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm rounded-md"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Line Chart
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="Bar" className="space-y-6">
              <Card className="bg-white border-0 shadow-sm">
                <CardContent className="p-6">
                  <BarChart data={chartDataProps} />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="Pie" className="space-y-6">
              <Card className="bg-white border-0 shadow-sm">
                <CardContent className="p-6">
                  <PieChart data={chartDataProps} />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="Line" className="space-y-6">
              <Card className="bg-white border-0 shadow-sm">
                <CardContent className="p-6">
                  <LineChart data={chartDataProps} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Chart;