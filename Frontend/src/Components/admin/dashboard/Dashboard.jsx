import { useEffect } from "react";
import { useGetAllProductsQuery } from "../../../redux/api/productAPI";
import { useFetchAllCategoriesQuery } from "../../../redux/api/categoryAPI";
import { useAllUsersMutation } from "../../../redux/api/userAPI";
import { useGetAllOrdersQuery } from "../../../redux/api/orderAPI";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import { Progress } from "@/Components/ui/progress";
import { ScrollArea } from "@/Components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/Components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Badge } from "@/Components/ui/badge";
import {
  Users,
  Package,
  FolderTree,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  ShoppingCart,
} from "lucide-react";
import Loader from "../../../Components/Loader/Loader";

const Dashboard = () => {
  const {
    data: productsData,
    isLoading: productsLoading,
    error: productsError,
  } = useGetAllProductsQuery();
  const {
    data: categoriesResponse,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useFetchAllCategoriesQuery();
  const [fetchAllUsers, { data: usersData, isLoading: usersLoading }] =
    useAllUsersMutation();
  const { data: ordersData, isLoading: ordersLoading } = useGetAllOrdersQuery();

  useEffect(() => {
    fetchAllUsers();
  }, [fetchAllUsers]);

  const productsArray = productsData?.products || [];
  const totalProductsQuantity = productsArray.length || 0;
  const totalCategoriesQuantity = categoriesResponse?.data?.length || 0;
  const totalUsersQuantity = usersData?.success ? usersData.users.length : 0;

  const deliveredOrders =
    ordersData?.orders?.filter((order) => order.status === "Delivered") || [];

  const productQuantities = {};
  deliveredOrders.forEach((order) => {
    order.orderItems.forEach((item) => {
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

  const subtotal = deliveredOrders.reduce(
    (acc, order) => acc + order.subtotal,
    0
  );
  const revenue = deliveredOrders.reduce((acc, order) => acc + order.total, 0);

  const topTransactions = deliveredOrders
    .sort((a, b) => b.subtotal - a.subtotal)
    .slice(0, 10);

  const headerData = [
    {
      label: "Total Users",
      value: usersLoading ? <Loader type="data" /> : totalUsersQuantity,
      accent: "text-blue-500",
      icon: <Users className="h-5 w-5 text-blue-500" />,
      percentage: 75,
      progressColor: "bg-blue-500",
    },
    {
      label: "Total Products",
      value: productsLoading ? <Loader type="data" /> : totalProductsQuantity,
      accent: "text-emerald-600",
      icon: <Package className="h-5 w-5 text-emerald-600" />,
      percentage: 90,
      progressColor: "bg-emerald-600",
    },
    {
      label: "Total Categories",
      value: categoriesLoading ? (
        <Loader type="data" />
      ) : (
        totalCategoriesQuantity
      ),
      accent: "text-purple-600",
      icon: <FolderTree className="h-5 w-5 text-purple-600" />,
      percentage: 100,
      progressColor: "bg-purple-600",
    },
    {
      label: "Total Sale",
      value: `₹${subtotal.toFixed(2)}`,
      accent: "text-green-600",
      icon: <DollarSign className="h-5 w-5 text-green-600" />,
      percentage: 60,
      progressColor: "bg-green-600",
    },
    {
      label: "Revenue",
      value: `₹${revenue.toFixed(2)}`,
      accent: "text-indigo-600",
      icon: <TrendingUp className="h-5 w-5 text-indigo-600" />,
      percentage: 95,
      progressColor: "bg-indigo-600",
    },
  ];

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container max-w-7xl p-4 md:p-6 space-y-6">
          {/* Main Header Container */}
          <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900">
                  Dashboard Overview
                </h1>
                <p className="text-gray-600 mt-1">
                  Monitor your business metrics and performance
                </p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {headerData.map((item, index) => (
              <Card key={index} className="bg-white shadow-sm hover:shadow-md">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    {item.icon}
                    <CardTitle className={`text-sm font-medium ${item.accent}`}>
                      {item.label}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className={`text-xl font-bold ${item.accent}`}>
                    {item.value}
                  </div>
                  <Progress
                    value={item.percentage}
                    className="mt-2 h-2 bg-gray-100"
                    indicatorClassName={item.progressColor}
                  />
                  <p className={`text-xs mt-1 bg-grey-500`}>
                    {item.percentage}% of target
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Inventory Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Top Products Sold */}
            <Card className="col-span-1 bg-white shadow-sm hover:shadow-md transition-all">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5 text-blue-500" />
                    Top Products Sold
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px] pr-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead className="text-right">Quantity</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {topProductsArray.map((product, index) => (
                        <TableRow key={index} className="hover:bg-gray-50">
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage
                                  src={product.photo}
                                  alt={product.name}
                                />
                                <AvatarFallback className="bg-gray-100 text-gray-600">
                                  {product.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm">{product.name}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge variant="secondary">
                              {product.quantity}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Product Inventory */}
            <Card className="col-span-1 bg-white shadow-sm hover:shadow-md transition-all">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Package className="h-5 w-5 text-emerald-500" />
                    Product Inventory
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {productsLoading ? (
                  <Loader type="data" />
                ) : productsError ? (
                  <p className="text-red-500">Error loading products</p>
                ) : (
                  <ScrollArea className="h-[300px] pr-4">
                    {productsArray.slice(0, 10).map((product, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 py-2 border-b hover:bg-gray-50"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={product.photo}
                            alt={product.title}
                          />
                          <AvatarFallback className="bg-emerald-100 text-emerald-600">
                            {product.title.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium truncate">
                              {product.title}
                            </p>
                            <Badge
                              variant={
                                product.stock > 0 ? "outline" : "destructive"
                              }
                              className="ml-2"
                            >
                              {product.stock > 0
                                ? `${product.stock} in stock`
                                : "Out of stock"}
                            </Badge>
                          </div>
                          <Tooltip>
                            <TooltipTrigger className="w-full">
                              <Progress
                                value={
                                  (product.stock /
                                    Math.max(
                                      ...productsArray.map((p) => p.stock ?? 0)
                                    )) *
                                  100
                                }
                                className="h-1 mt-2 bg-gray-100"
                                indicatorClassName={
                                  product.stock === 0
                                    ? "bg-gray-300"
                                    : product.stock < 10
                                    ? "bg-gray-500"
                                    : "bg-gray-900"
                                }
                              />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs">
                                Stock Level: {product.stock} units
                              </p>
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
            <Card className="col-span-1 bg-white shadow-sm hover:shadow-md transition-all">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <FolderTree className="h-5 w-5 text-purple-500" />
                    Category Inventory
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {categoriesLoading ? (
                  <Loader type="data" />
                ) : categoriesError ? (
                  <p className="text-red-500">Error loading categories</p>
                ) : (
                  <ScrollArea className="h-[300px] pr-4">
                    <div className="space-y-2">
                      {Array.isArray(categoriesResponse?.data) ? (
                        categoriesResponse.data.map((category, index) => (
                          <div
                            key={index}
                            className="p-3 rounded-lg border bg-white hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                                  {category.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <h5 className="font-medium">
                                    {category.name}
                                  </h5>
                                  <p className="text-xs text-gray-500">
                                    Added on{" "}
                                    {new Date(
                                      category.createdAt
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <Badge variant="secondary" className="ml-2">
                                {category.products?.length || 0} products
                              </Badge>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4 text-gray-500">
                          No categories available.
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Top Transactions */}
          <Card className="bg-white shadow-sm hover:shadow-md transition-all">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-indigo-500" />
                  Top Transactions
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {ordersLoading ? (
                <Loader type="data" />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topTransactions.length > 0 ? (
                      topTransactions.map((transaction, index) => (
                        <TableRow key={index} className="hover:bg-gray-50">
                          <TableCell className="font-medium">
                            #{transaction._id.slice(-8)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage
                                  src={transaction.user?.photo}
                                  alt={transaction.user?.name}
                                />
                                <AvatarFallback className="bg-indigo-100 text-indigo-600">
                                  {(transaction.user?.name || "N").charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="text-sm">
                                {transaction.user?.name || "User"}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className="flex items-center gap-1 w-fit"
                            >
                              <CheckCircle className="h-3 w-3 text-green-500" />
                              Delivered
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-bold text-green-600">
                            ₹{transaction.subtotal.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-sm text-gray-500">
                            {new Date(
                              transaction.createdAt
                            ).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center py-8 text-gray-500"
                        >
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
      </div>
    </TooltipProvider>
  );
};

export default Dashboard;
