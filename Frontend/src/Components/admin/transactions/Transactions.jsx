// AdminTransactions.jsx - Professional e-commerce redesign matching other admin pages
import { useState, useEffect, useMemo } from 'react';
import { useGetAllOrdersQuery, useUpdateOrderStatusMutation } from '../../../redux/api/orderAPI';
import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/Components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/Components/ui/pagination';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/Components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/Components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar';
import { Badge } from '@/Components/ui/badge';
import { Separator } from '@/Components/ui/separator';
import { Search, Plus, List, Grid, Edit, X, Clock, Package, Truck, CheckCircle } from 'lucide-react';

const ITEMS_PER_PAGE = 12;

const AdminTransactions = () => {
  const { data, error, isLoading, refetch } = useGetAllOrdersQuery();
  const [updateOrderStatus] = useUpdateOrderStatusMutation();

  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [statusFilter, setStatusFilter] = useState('all');

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const resetPage = () => setCurrentPage(1);

  // Filter and sort orders
  const filteredAndSortedOrders = useMemo(() => {
    let filtered = data?.orders || [];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter((order) => {
        const searchLower = searchTerm.toLowerCase();
        return (
          order._id.toLowerCase().includes(searchLower) ||
          order.status.toLowerCase().includes(searchLower) ||
          order.orderItems.some((item) =>
            item.name.toLowerCase().includes(searchLower)
          ) ||
          order.user?.name?.toLowerCase().includes(searchLower)
        );
      });
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'total':
          return b.total - a.total;
        default:
          return 0;
      }
    });

    return filtered;
  }, [data, searchTerm, statusFilter, sortBy]);

  const totalPages = Math.ceil(filteredAndSortedOrders.length / ITEMS_PER_PAGE);
  const paginatedOrders = filteredAndSortedOrders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const truncateText = (text, maxLength = 30) => {
    if (!text) return '—';
    return text.length <= maxLength ? text : text.slice(0, maxLength) + '...';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Processing': return <Clock className="h-3 w-3 text-yellow-500" />;
      case 'Shipped': return <Truck className="h-3 w-3 text-blue-500" />;
      case 'Delivered': return <CheckCircle className="h-3 w-3 text-green-500" />;
      default: return null;
    }
  };

  const openPopup = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
  };

  const closePopup = () => {
    setSelectedOrder(null);
    setShowConfirmation(false);
  };

  const confirmStatusChange = async () => {
    if (newStatus === 'Delivered' && selectedOrder.status !== 'Delivered') {
      setShowConfirmation(true);
    } else {
      await handleChangeStatus();
    }
  };

  const handleChangeStatus = async () => {
    if (selectedOrder) {
      try {
        await updateOrderStatus({ id: selectedOrder._id, status: newStatus }).unwrap();
        toast.success('Order status updated successfully!');
        refetch();
        closePopup();
      } catch (err) {
        toast.error('Failed to update order status.');
      }
    }
  };

  if (isLoading) return <div className="flex items-center justify-center py-20 text-xl text-gray-600">Loading...</div>;
  if (error) return <div className="flex items-center justify-center py-20 text-xl text-red-600">Error loading orders.</div>;

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto max-w-6xl p-4 md:p-6 space-y-6">
          {/* === MAIN HEADER CONTAINER === */}
          <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
            {/* === MAIN ROW: Left (Title), Middle (Search), Right (Add Button) === */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Left: Transaction Management Title */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900">Transaction Management</h1>
                <p className="text-gray-600 mt-1">Monitor and manage your e-commerce orders professionally</p>
                <p className="text-sm text-gray-600 mt-2">{filteredAndSortedOrders.length} transaction(s)</p>
              </div>

              {/* Middle: Search Input (Centered in the row) */}
              <div className="flex-1 max-w-md mx-auto lg:mx-0">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Search by order ID, customer, status, or item..."
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); resetPage(); }}
                    className="pl-12 w-full h-12 text-base border-gray-300 focus:border-black"
                  />
                </div>
              </div>

              {/* Right: Add Transaction Button (Placeholder) */}
              <div className="flex-shrink-0">
                <Button
                  onClick={() => toast.info('Create new order functionality coming soon!')}
                  className="bg-black text-white shadow-md whitespace-nowrap"
                  size="lg"
                >
                  <Plus className="mr-2 h-5 w-5" />
                  New Order
                </Button>
              </div>
            </div>

            {/* === FILTERS & SORTING ROW (Left: Filters, Right: View Toggle) === */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2 flex-1">
                {/* Sort */}
                <Select value={sortBy} onValueChange={(v) => { setSortBy(v); resetPage(); }}>
                  <SelectTrigger className="w-40 h-10 text-sm">
                    <SelectValue placeholder="Sort" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Date (Newest)</SelectItem>
                    <SelectItem value="total">Total (High to Low)</SelectItem>
                  </SelectContent>
                </Select>

                {/* Status Filter Buttons */}
                <div className="flex items-center gap-2">
                  <Button
                    variant={statusFilter === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => { setStatusFilter('all'); resetPage(); }}
                    className="h-10"
                  >
                    All Status
                  </Button>
                  <Button
                    variant={statusFilter === 'Processing' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => { setStatusFilter('Processing'); resetPage(); }}
                    className="h-10 flex items-center gap-1"
                  >
                    <Clock className="h-3 w-3 text-yellow-500" />
                    Processing
                  </Button>
                  <Button
                    variant={statusFilter === 'Shipped' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => { setStatusFilter('Shipped'); resetPage(); }}
                    className="h-10 flex items-center gap-1"
                  >
                    <Truck className="h-3 w-3 text-blue-500" />
                    Shipped
                  </Button>
                  <Button
                    variant={statusFilter === 'Delivered' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => { setStatusFilter('Delivered'); resetPage(); }}
                    className="h-10 flex items-center gap-1"
                  >
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    Delivered
                  </Button>
                </div>
              </div>

              {/* View Toggle (List/Grid) - Positioned on the right side of the row */}
              <div className="flex rounded-md overflow-hidden border">
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  className="h-10 px-3 rounded-none"
                  onClick={() => { setViewMode('list'); resetPage(); }}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  className="h-10 px-3 rounded-none border-l"
                  onClick={() => { setViewMode('grid'); resetPage(); }}
                >
                  <Grid className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* === LIST VIEW (Professional Table) === */}
          {viewMode === 'list' && (
            <Card className="border-0 shadow-lg rounded-xl overflow-hidden">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="px-4 py-3 font-medium">Order ID</TableHead>
                        <TableHead className="px-4 py-3 font-medium">Customer</TableHead>
                        <TableHead className="px-4 py-3 font-medium">Date</TableHead>
                        <TableHead className="px-4 py-3 font-medium">Status</TableHead>
                        <TableHead className="px-4 py-3 font-medium text-right">Total</TableHead>
                        <TableHead className="px-4 py-3 font-medium text-center">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedOrders.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-12 text-gray-500">
                            No transactions found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        paginatedOrders.map((order) => (
                          <TableRow
                            key={order._id}
                            className="hover:bg-gray-50 border-b cursor-pointer transition-colors"
                            onClick={() => openPopup(order)}
                          >
                            <TableCell className="px-4 py-3 font-mono text-sm text-gray-600">
                              #{order._id.slice(-8)}
                            </TableCell>
                            <TableCell className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8 flex-shrink-0">
                                  <AvatarImage src={order.user?.photo} alt={order.user?.name} />
                                  <AvatarFallback>{order.user?.name?.charAt(0)?.toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <span className="font-medium text-sm">{truncateText(order.user?.name || 'N/A', 20)}</span>
                              </div>
                            </TableCell>
                            <TableCell className="px-4 py-3 text-sm text-gray-600">
                              {new Date(order.createdAt).toLocaleDateString('en-US', { 
                                year: 'numeric', month: 'short', day: 'numeric' 
                              })}
                            </TableCell>
                            <TableCell className="px-4 py-3">
                              <Badge 
                                variant={
                                  order.status === 'Delivered' ? 'default' : 
                                  order.status === 'Shipped' ? 'secondary' : 'outline'
                                } 
                                className="text-xs font-medium flex items-center gap-1"
                              >
                                {getStatusIcon(order.status)}
                                {order.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="px-4 py-3 text-right font-bold text-lg text-green-600">
                              ₹{order.total.toFixed(2)}
                            </TableCell>
                            <TableCell className="px-4 py-3 text-center">
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openPopup(order);
                                }}
                                className="hover:bg-gray-100"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* === GRID VIEW (Professional Cards) === */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {paginatedOrders.length === 0 ? (
                <div className="col-span-full text-center py-12 text-gray-500">
                  No transactions found.
                </div>
              ) : (
                paginatedOrders.map((order) => (
                  <Card
                    key={order._id}
                    className="group relative hover:shadow-lg transition-all cursor-pointer overflow-hidden border hover:border-gray-300"
                    onClick={() => openPopup(order)}
                  >
                    <CardContent className="p-4 space-y-3">
                      {/* Order Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-10 w-10 flex-shrink-0">
                            <AvatarImage src={order.user?.photo} alt={order.user?.name} />
                            <AvatarFallback>{order.user?.name?.charAt(0)?.toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-medium text-sm line-clamp-1">{truncateText(order.user?.name || 'N/A', 20)}</h3>
                            <p className="text-xs text-gray-500">#{order._id.slice(-8)}</p>
                          </div>
                        </div>
                        <Badge 
                          variant={
                            order.status === 'Delivered' ? 'default' : 
                            order.status === 'Shipped' ? 'secondary' : 'outline'
                          } 
                          className="text-xs font-medium flex items-center gap-1"
                        >
                          {getStatusIcon(order.status)}
                          {order.status}
                        </Badge>
                      </div>

                      {/* Order Summary */}
                      <Separator className="my-2" />
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Total Items:</span>
                          <span className="text-sm">{order.orderItems.length}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Order Total:</span>
                          <span className="text-lg font-bold text-green-600">₹{order.total.toFixed(2)}</span>
                        </div>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(order.createdAt).toLocaleDateString('en-US', { 
                            year: 'numeric', month: 'short', day: 'numeric' 
                          })}
                        </p>
                      </div>

                      {/* Quick Actions */}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="w-full h-8 text-sm justify-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          openPopup(order);
                        }}
                      >
                        <Edit className="h-3 w-3 mr-1" /> View & Update
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}

          {/* === PAGINATION === */}
          {totalPages > 1 && (
            <div className="flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                  {[...Array(totalPages)].map((_, i) => (
                    <PaginationItem key={i + 1}>
                      <PaginationLink
                        onClick={() => setCurrentPage(i + 1)}
                        isActive={currentPage === i + 1}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}

          {/* === ORDER DETAILS MODAL (Professional E-commerce Style) === */}
          {selectedOrder && (
            <Dialog open={true} onOpenChange={closePopup}>
              <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader className="border-b pb-4">
                  <div className="flex items-center justify-between">
                    <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                      Order #{selectedOrder._id.slice(-8)}
                    </DialogTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={closePopup}
                      className="h-8 w-8"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </DialogHeader>
                <div className="space-y-6 pt-4">
                  {/* Order Summary */}
                  <Card>
                    <CardContent className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={selectedOrder.user?.photo} alt={selectedOrder.user?.name} />
                            <AvatarFallback>{selectedOrder.user?.name?.charAt(0)?.toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{selectedOrder.user?.name || 'N/A'}</p>
                            <p className="text-sm text-gray-600">{selectedOrder.user?.email || 'N/A'}</p>
                          </div>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Order Date:</span>
                            <span className="font-medium">{new Date(selectedOrder.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Total Items:</span>
                            <span className="font-medium">{selectedOrder.orderItems.length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Order Total:</span>
                            <span className="font-bold text-lg text-green-600">₹{selectedOrder.total.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Status:</span>
                            <Badge 
                              variant={selectedOrder.status === 'Delivered' ? 'default' : selectedOrder.status === 'Shipped' ? 'secondary' : 'outline'}
                              className="flex items-center gap-1"
                            >
                              {getStatusIcon(selectedOrder.status)}
                              {selectedOrder.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Items List */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        Order Items
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {selectedOrder.orderItems.map((item) => (
                          <div key={item.productId} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <Avatar className="h-12 w-12 flex-shrink-0">
                              <AvatarImage src={item.photo} alt={item.name} />
                              <AvatarFallback>{item.name?.charAt(0)?.toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm">{truncateText(item.name, 40)}</p>
                              <p className="text-xs text-gray-600">Qty: {item.quantity} × ₹{item.price.toFixed(2)}</p>
                              <p className="text-xs font-medium text-green-600">Subtotal: ₹{(item.quantity * item.price).toFixed(2)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Status Update */}
                  <div className="flex items-center gap-3 pt-2">
                    <Select value={newStatus} onValueChange={setNewStatus}>
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Update status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Processing">Processing</SelectItem>
                        <SelectItem value="Shipped">Shipped</SelectItem>
                        <SelectItem value="Delivered">Delivered</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button onClick={confirmStatusChange} className="bg-blue-600 hover:bg-blue-700">
                      Update Status
                    </Button>
                  </div>
                </div>
                <DialogFooter className="flex justify-end gap-2 pt-6 border-t">
                  <Button variant="outline" onClick={closePopup}>
                    Close
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          {/* === CONFIRMATION MODAL === */}
          {showConfirmation && (
            <Dialog open={true} onOpenChange={setShowConfirmation}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-lg font-semibold flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Confirm Delivery
                  </DialogTitle>
                  <DialogDescription>
                    Marking this order as "Delivered" will finalize the transaction. This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2">
                  <Button variant="outline" onClick={() => setShowConfirmation(false)}>
                    Cancel
                  </Button>
                  <Button variant="default" onClick={handleChangeStatus} className="bg-green-600 hover:bg-green-700">
                    Confirm Delivery
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminTransactions;