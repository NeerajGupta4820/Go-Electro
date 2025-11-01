// Customers.jsx - Updated to match AdminProduct/AdminCategory UI & functionality
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAllUsersMutation } from '../../../redux/api/userAPI';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, List, Grid, Edit, Trash2, X } from 'lucide-react';

const ITEMS_PER_PAGE = 12;

const Customers = () => {
  const navigate = useNavigate();
  const [allUsers, { isLoading, isError, error }] = useAllUsersMutation();
  const [users, setUsers] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [roleFilter, setRoleFilter] = useState('all');

  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const result = await allUsers().unwrap();
        setUsers(result.users || []);
      } catch (err) {
        console.error('Error fetching users:', err);
        toast.error('Failed to fetch users. Please try again.');
      }
    };

    fetchUsers();
  }, [allUsers]);

  const resetPage = () => setCurrentPage(1);

  // Filter and sort users
  const filteredAndSortedUsers = useMemo(() => {
    let filtered = [...users];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'email':
          return a.email.localeCompare(b.email);
        default:
          return 0;
      }
    });

    return filtered;
  }, [users, searchTerm, roleFilter, sortBy]);

  const totalPages = Math.ceil(filteredAndSortedUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = filteredAndSortedUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleEdit = (id) => {
    // Placeholder for edit - navigate or open form
    toast.info('Edit functionality coming soon!');
  };

  const truncateText = (text, maxLength = 30) => {
    if (!text) return '—';
    return text.length <= maxLength ? text : text.slice(0, maxLength) + '...';
  };

  if (isLoading) return <div className="flex items-center justify-center py-20 text-xl text-gray-600">Loading...</div>;
  if (isError) return <div className="flex items-center justify-center py-20 text-xl text-red-600">Error loading users.</div>;

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto max-w-6xl p-4 md:p-6 space-y-6">
          {/* === MAIN HEADER CONTAINER === */}
          <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
            {/* === MAIN ROW: Left (Title), Middle (Search), Right (Add Button) === */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Left: Customer Management Title */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900">Customer Management</h1>
                <p className="text-gray-600 mt-1">View and manage your customers</p>
                <p className="text-sm text-gray-600 mt-2">{filteredAndSortedUsers.length} customer(s)</p>
              </div>

              {/* Middle: Search Input (Centered in the row) */}
              <div className="flex-1 max-w-md mx-auto lg:mx-0">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Search customers by name or email..."
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); resetPage(); }}
                    className="pl-12 w-full h-12 text-base border-gray-300 focus:border-black"
                  />
                </div>
              </div>

              {/* Right: Add Customer Button (Placeholder) */}
              <div className="flex-shrink-0">
                <Button
                  onClick={() => toast.info('Add customer functionality coming soon!')}
                  className="bg-black text-white shadow-md whitespace-nowrap"
                  size="lg"
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Add New Customer
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
                    <SelectItem value="name">Name (A-Z)</SelectItem>
                    <SelectItem value="email">Email (A-Z)</SelectItem>
                  </SelectContent>
                </Select>

                {/* Role Filter */}
                <Select value={roleFilter} onValueChange={(v) => { setRoleFilter(v); resetPage(); }}>
                  <SelectTrigger className="w-44 h-10 text-sm">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
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

          {/* Render Users Display */}
          {viewMode === 'list' && (
            <Card className="border-0 shadow-lg rounded-xl overflow-hidden">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="w-16 px-4 py-3">Photo</TableHead>
                        <TableHead className="px-4 py-3">Name</TableHead>
                        <TableHead className="px-4 py-3">Email</TableHead>
                        <TableHead className="px-4 py-3">Role</TableHead>
                        <TableHead className="px-4 py-3 text-center">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedUsers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-12 text-gray-500">
                            No customers found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        paginatedUsers.map((user) => (
                          <TableRow
                            key={user._id || user.id}
                            className="hover:bg-gray-50 border-b cursor-pointer"
                            onClick={() => setSelectedUser(user)}
                          >
                            <TableCell className="px-4 py-3">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={user.photo} alt={user.name} />
                                <AvatarFallback className="bg-gray-200 text-gray-600">
                                  {user.name?.charAt(0)?.toUpperCase() || 'U'}
                                </AvatarFallback>
                              </Avatar>
                            </TableCell>
                            <TableCell className="px-4 py-3 font-medium">
                              {truncateText(user.name, 20)}
                            </TableCell>
                            <TableCell className="px-4 py-3">
                              {truncateText(user.email, 30)}
                            </TableCell>
                            <TableCell className="px-4 py-3">
                              <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className="text-xs">
                                {user.role}
                              </Badge>
                            </TableCell>
                            <TableCell className="px-4 py-3 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEdit(user._id || user.id);
                                  }}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </div>
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

          {/* === GRID VIEW === */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {paginatedUsers.length === 0 ? (
                <div className="col-span-full text-center py-12 text-gray-500">
                  No customers found.
                </div>
              ) : (
                paginatedUsers.map((user) => (
                  <div
                    key={user._id || user.id}
                    className="group relative bg-white rounded-xl shadow-sm hover:shadow-lg transition-all cursor-pointer overflow-hidden border"
                    onClick={() => setSelectedUser(user)}
                  >
                    <div className="aspect-square p-3 bg-gray-50 flex items-center justify-center">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={user.photo} alt={user.name} />
                        <AvatarFallback className="bg-gray-200 text-gray-600 text-lg">
                          {user.name?.charAt(0)?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="p-3 space-y-1">
                      <h3 className="font-medium text-sm line-clamp-2">{truncateText(user.name, 25)}</h3>
                      <p className="text-xs text-gray-600">{truncateText(user.email, 30)}</p>
                      <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className="text-xs">
                        {user.role}
                      </Badge>
                    </div>
                    <div className="flex gap-1 p-2 pt-0">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 px-2 flex-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(user._id || user.id);
                        }}
                      >
                        <Edit className="h-3 w-3 mr-1" /> Edit
                      </Button>
                    </div>
                  </div>
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

          {/* === USER DETAILS MODAL === */}
          {selectedUser && (
            <Dialog open={true} onOpenChange={() => setSelectedUser(null)}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold">{selectedUser.name}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Avatar className="w-24 h-24 mx-auto">
                    <AvatarImage src={selectedUser.photo} alt={selectedUser.name} />
                    <AvatarFallback className="bg-gray-200 text-gray-600 text-2xl">
                      {selectedUser.name?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <p className="text-sm"><strong>Email:</strong> {selectedUser.email}</p>
                    <p className="text-sm"><strong>Role:</strong> <Badge variant={selectedUser.role === 'admin' ? 'default' : 'secondary'}>{selectedUser.role}</Badge></p>
                  </div>
                </div>
                <DialogFooter className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setSelectedUser(null)}>
                    Close
                  </Button>
                  <Button onClick={() => handleEdit(selectedUser._id || selectedUser.id)}>
                    <Edit className="mr-2 h-4 w-4" /> Edit
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

export default Customers;