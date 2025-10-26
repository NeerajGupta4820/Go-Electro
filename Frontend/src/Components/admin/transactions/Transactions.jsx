import { useState, useEffect } from "react";
import { useGetAllOrdersQuery, useUpdateOrderStatusMutation } from "../../../redux/api/orderAPI";
import { ToastContainer, toast } from "react-toastify";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Search, X } from "lucide-react";

const AdminTransactions = () => {
  const { data, error, isLoading, refetch } = useGetAllOrdersQuery();
  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    if (data && orders.length === 0) {
      setOrders(Array.isArray(data) ? data : data?.orders || []);
    }
  }, [data, orders.length]);

  // Filter orders based on search term
  const filteredOrders = orders.filter((order) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      order._id.toLowerCase().includes(searchLower) ||
      order.status.toLowerCase().includes(searchLower) ||
      order.orderItems.some((item) =>
        item.name.toLowerCase().includes(searchLower)
      )
    );
  });

  const openPopup = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
  };

  const closePopup = () => {
    setSelectedOrder(null);
    setShowConfirmation(false);
  };

  const confirmStatusChange = async () => {
    if (newStatus === "Delivered" && selectedOrder.status !== "Delivered") {
      setShowConfirmation(true);
    } else {
      await handleChangeStatus();
    }
  };

  const handleChangeStatus = async () => {
    if (selectedOrder) {
      try {
        await updateOrderStatus({ id: selectedOrder._id, status: newStatus }).unwrap();
        toast.success("Order status updated successfully!", {
          className: "bg-green-500 text-white p-4 rounded-lg",
          progressClassName: "bg-white",
        });
        const updatedOrders = orders.map((order) =>
          order._id === selectedOrder._id ? { ...order, status: newStatus } : order
        );
        setOrders(updatedOrders);
        refetch();
        closePopup();
      } catch (err) {
        toast.error("Failed to update order status.", {
          className: "bg-red-500 text-white p-4 rounded-lg",
          progressClassName: "bg-white",
        });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-green-600 text-lg font-medium">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500 text-lg font-medium">
        Failed to load orders: {error?.data?.message || error.message}
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="max-w-6xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg min-h-screen sm:p-4 xs:p-3">
        <ToastContainer toastClassName="min-w-[300px]" />
        <Card className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-teal-500 bg-white">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-green-700 sm:text-2xl xs:text-xl">
              All Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6 flex items-center gap-3">
              <Input
                type="text"
                placeholder="Search by Order ID, Status, or Item Name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-md"
              />
              <Search className="h-5 w-5 text-teal-600" />
            </div>
            {filteredOrders.length === 0 ? (
              <p className="text-center text-gray-500 text-sm">No orders found.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-green-500 hover:bg-green-500">
                    <TableHead className="text-white font-bold text-left p-4 sm:p-3 xs:p-2">
                      Photos
                    </TableHead>
                    <TableHead className="text-white font-bold text-left p-4 sm:p-3 xs:p-2">
                      Date
                    </TableHead>
                    <TableHead className="text-white font-bold text-left p-4 sm:p-3 xs:p-2">
                      Status
                    </TableHead>
                    <TableHead className="text-white font-bold text-left p-4 sm:p-3 xs:p-2">
                      Total
                    </TableHead>
                    <TableHead className="text-white font-bold text-left p-4 sm:p-3 xs:p-2">
                      Price
                    </TableHead>
                    <TableHead className="text-white font-bold text-left p-4 sm:p-3 xs:p-2">
                      Quantity
                    </TableHead>
                    <TableHead className="text-white font-bold text-left p-4 sm:p-3 xs:p-2">
                      Manage
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) =>
                    order.orderItems.map((item, index) => (
                      <TableRow
                        key={`${order._id}-${item.productId}`}
                        className={`${
                          index % 2 === 0 ? "bg-white" : "bg-blue-100"
                        } hover:bg-blue-200 transition-colors`}
                      >
                        <TableCell className="p-4 sm:p-3 xs:p-2">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12 sm:h-10 sm:w-10 xs:h-9 xs:w-9">
                              <AvatarImage src={item.photo} alt={item.name} />
                              <AvatarFallback>
                                {item.name ? item.name[0].toUpperCase() : "P"}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-teal-600 truncate max-w-[150px] sm:text-sm xs:text-xs" title={item.name}>
                              {item.name.slice(0, 15)}...
                            </span>
                          </div>
                        </TableCell>
                        {index === 0 && (
                          <>
                            <TableCell rowSpan={order.orderItems.length} className="text-teal-600 sm:text-sm xs:text-xs">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell rowSpan={order.orderItems.length} className="text-teal-600 sm:text-sm xs:text-xs">
                              {order.status}
                            </TableCell>
                            <TableCell rowSpan={order.orderItems.length} className="text-teal-600 sm:text-sm xs:text-xs">
                              Rs.{order.total.toFixed(2)}
                            </TableCell>
                          </>
                        )}
                        <TableCell className="text-teal-600 sm:text-sm xs:text-xs">
                          Rs.{item.price.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-teal-600 sm:text-sm xs:text-xs">
                          {item.quantity}
                        </TableCell>
                        {index === 0 && (
                          <TableCell rowSpan={order.orderItems.length}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => openPopup(order)}
                                  className="bg-blue-600 hover:bg-blue-700 text-white border-none hover:scale-105 transition-all"
                                  aria-label="View order details"
                                >
                                  View Details
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>View Order Details</p>
                              </TooltipContent>
                            </Tooltip>
                          </TableCell>
                        )}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Dialog open={!!selectedOrder} onOpenChange={closePopup}>
          <DialogContent className="sm:max-w-[425px] bg-white border-l-4 border-teal-500">
            <Button
              variant="ghost"
              className="absolute top-3 right-3 text-teal-600 hover:text-teal-800 p-1"
              onClick={closePopup}
              aria-label="Close order details"
            >
              <X className="h-6 w-6" />
            </Button>
            <DialogHeader>
              <DialogTitle className="text-green-700">Order Details</DialogTitle>
            </DialogHeader>
            {selectedOrder && (
              <div className="space-y-4">
                <p className="text-teal-600">
                  <strong>Order ID:</strong> {selectedOrder._id}
                </p>
                <p className="text-teal-600">
                  <strong>Date:</strong>{" "}
                  {new Date(selectedOrder.createdAt).toLocaleDateString()}
                </p>
                <p className="text-teal-600">
                  <strong>Total:</strong> Rs.{selectedOrder.total.toFixed(2)}
                </p>
                <p className="text-teal-600">
                  <strong>Status:</strong> {selectedOrder.status}
                </p>
                <div>
                  <h4 className="font-semibold text-teal-600">Items:</h4>
                  <ul className="space-y-2">
                    {selectedOrder.orderItems.map((item) => (
                      <li key={item.productId} className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={item.photo} alt={item.name} />
                          <AvatarFallback>
                            {item.name ? item.name[0].toUpperCase() : "P"}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-teal-600 text-sm">
                          {item.name} - Qty: {item.quantity} - Rs.{item.price.toFixed(2)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex items-center gap-3">
                  <Select
                    value={newStatus}
                    onValueChange={setNewStatus}
                    disabled={selectedOrder.status === "Delivered"}
                  >
                    <SelectTrigger className="w-[180px] border-teal-500">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Processing">Processing</SelectItem>
                      <SelectItem value="Shipped">Shipped</SelectItem>
                      <SelectItem value="Delivered">Delivered</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={confirmStatusChange}
                    disabled={selectedOrder.status === "Delivered"}
                    className="bg-blue-600 hover:bg-blue-700 hover:scale-105 transition-all"
                  >
                    Change
                  </Button>
                </div>
              </div>
            )}
            <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
              <DialogContent className="sm:max-w-[425px] bg-white border-l-4 border-teal-500">
                <DialogHeader>
                  <DialogTitle className="text-green-700">Confirm Status Change</DialogTitle>
                </DialogHeader>
                <p className="text-teal-600">
                  Are you sure you want to mark this order as "Delivered"? This action
                  cannot be undone.
                </p>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setShowConfirmation(false)}
                    className="border-teal-500 text-teal-600 hover:text-teal-800"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleChangeStatus}
                    className="bg-blue-600 hover:bg-blue-700 hover:scale-105 transition-all"
                  >
                    Yes, Confirm
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
};

export default AdminTransactions;