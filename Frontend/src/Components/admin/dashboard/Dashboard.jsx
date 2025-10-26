import { useEffect } from "react";
import { useGetAllProductsQuery } from '../../../redux/api/productAPI';
import { useFetchAllCategoriesQuery } from '../../../redux/api/categoryAPI'; 
import { useAllUsersMutation } from '../../../redux/api/userAPI'; 
import { useGetAllOrdersQuery } from '../../../redux/api/orderAPI'; 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
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

  const headerData = [
    { label: "Total Users", value: usersLoading ? <Loader type="data" /> : totalUsersQuantity, percentage: 75, color: "bg-blue-100" },
    { label: "Total Products", value: productsLoading ? <Loader type="data" /> : totalProductsQuantity, percentage: 90, color: "bg-teal-100" },
    { label: "Total Categories", value: categoriesLoading ? <Loader type="data" /> : totalCategoriesQuantity, percentage: 100, color: "bg-purple-100" },
    { label: "Total Sale", value: `Rs.${subtotal.toFixed(2)}`, percentage: 60, color: "bg-green-100" },
    { label: "Revenue", value: `Rs.${revenue.toFixed(2)}`, percentage: 95, color: "bg-indigo-100" },
  ];

  return (
    <TooltipProvider>
      <div className="container mx-auto p-6 space-y-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
        {/* Dashboard Header */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {headerData.map((item, index) => (
            <Card
              key={index}
              className={`shadow-lg hover:shadow-xl transition-shadow ${item.color} border-l-4 border-${item.color.split('-')[1]}-500`}
            >
              <CardHeader>
                <CardTitle className={`text-sm font-medium text-${item.color.split('-')[1]}-700`}>{item.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold text-${item.color.split('-')[1]}-800`}>{item.value}</div>
                <Progress
                  value={item.percentage}
                  className={`mt-2 h-3 bg-${item.color.split('-')[1]}-200`}
                  indicatorClassName={`bg-${item.color.split('-')[1]}-500`}
                />
                <p className={`text-xs text-${item.color.split('-')[1]}-600 mt-1`}>{item.percentage}% of target</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Inventory Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Products Sold */}
          <Card className="col-span-1 bg-white shadow-lg hover:shadow-xl transition-shadow border-l-4 border-blue-500">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-blue-700">Top Products Sold</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-blue-50">
                      <TableHead className="text-blue-700">Product Name</TableHead>
                      <TableHead className="text-blue-700">Quantity Sold</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topProductsArray.map((product, index) => (
                      <TableRow key={index} className="hover:bg-blue-50">
                        <TableCell className="text-blue-600">{product.name}</TableCell>
                        <TableCell className="text-blue-600">{product.quantity}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Product Inventory */}
          <Card className="col-span-1 bg-white shadow-lg hover:shadow-xl transition-shadow border-l-4 border-teal-500">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-teal-700">Product Inventory</CardTitle>
            </CardHeader>
            <CardContent>
              {productsLoading ? (
                <Loader type="data" />
              ) : productsError ? (
                <p className="text-red-500">Error loading products</p>
              ) : (
                <ScrollArea className="h-[300px]">
                  {productsArray.slice(0, 10).map((product, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b hover:bg-teal-50">
                      <span className="text-sm font-medium text-teal-700">{product.title}</span>
                      <div className="w-1/2">
                        <Tooltip>
                          <TooltipTrigger>
                            <Progress
                              value={(product.stock / Math.max(...productsArray.map((p) => p.stock ?? 0))) * 100}
                              className={`h-3 bg-teal-200 ${product.stock > 700 ? 'bg-red-200' : product.stock > 400 ? 'bg-yellow-200' : 'bg-green-200'}`}
                              indicatorClassName={product.stock > 700 ? 'bg-red-500' : product.stock > 400 ? 'bg-yellow-500' : 'bg-green-500'}
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Stock: {product.stock}</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              )}
            </CardContent>
          </Card>

          {/* Category Inventory */}
          <Card className="col-span-1 bg-white shadow-lg hover:shadow-xl transition-shadow border-l-4 border-purple-500">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-purple-700">Category Inventory</CardTitle>
            </CardHeader>
            <CardContent>
              {categoriesLoading ? (
                <Loader type="data" />
              ) : categoriesError ? (
                <p className="text-red-500">Error loading categories</p>
              ) : (
                <ScrollArea className="h-[300px]">
                  {Array.isArray(categoriesResponse?.data) ? (
                    categoriesResponse.data.map((category, index) => (
                      <div key={index} className="py-2 border-b hover:bg-purple-50">
                        <h5 className="text-sm font-medium text-purple-700">{category.name}</h5>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No categories available.</p>
                  )}
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Top Transactions */}
        <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow border-l-4 border-indigo-500">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-indigo-700">Top Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            {ordersLoading ? (
              <Loader type="data" />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-indigo-50">
                    <TableHead className="text-indigo-700">Transaction ID</TableHead>
                    <TableHead className="text-indigo-700">Customer</TableHead>
                    <TableHead className="text-indigo-700">Amount</TableHead>
                    <TableHead className="text-indigo-700">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topTransactions.length > 0 ? (
                    topTransactions.map((transaction, index) => (
                      <TableRow key={index} className="hover:bg-indigo-50">
                        <TableCell className="text-indigo-600">{transaction._id}</TableCell>
                        <TableCell className="text-indigo-600">{transaction.customerName || 'Neeraj'}</TableCell>
                        <TableCell className="text-indigo-600">Rs.{transaction.subtotal.toFixed(2)}</TableCell>
                        <TableCell className="text-indigo-600">{new Date(transaction.createdAt).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-gray-500">
                        No delivered transactions available.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
};

export default Dashboard;