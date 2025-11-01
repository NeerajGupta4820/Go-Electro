// AdminProduct.jsx - Restructured layout as requested
import { useState, useEffect, useMemo } from 'react';
import { useGetAllProductsQuery, useDeleteProductMutation } from '../../../redux/api/productAPI';
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
import { Search, Plus, List, Grid } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AllProduct from './AllProduct';

const ITEMS_PER_PAGE = 12;

const AdminProduct = () => {
  const navigate = useNavigate();
  const { data, isLoading, error, refetch } = useGetAllProductsQuery();
  const [deleteProduct] = useDeleteProductMutation();

  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [actionProduct, setActionProduct] = useState(null);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteProduct(id).unwrap();
      toast.success('Product deleted successfully!');
      setActionProduct(null);
      setSelectedProduct(null);
      refetch();
    } catch (err) {
      toast.error('Failed to delete product.');
    }
  };

  const handleUpdate = (id) => {
    setActionProduct(null);
    setSelectedProduct(null);
    navigate(`update/${id}`);
  };

  const getCategoryName = (category) => {
    if (!category) return 'Uncategorized';
    return typeof category === 'string' ? category : category.name || 'Uncategorized';
  };

  const truncateText = (text, maxLength = 40) => {
    if (!text) return '—';
    return text.length <= maxLength ? text : text.slice(0, maxLength) + '...';
  };

  const categories = useMemo(() => {
    const cats = new Set();
    data?.products?.forEach((p) => {
      const name = getCategoryName(p.category);
      if (name !== 'Uncategorized') cats.add(name);
    });
    return ['all', ...Array.from(cats)].sort();
  }, [data]);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = data?.products || [];

    if (searchTerm) {
      filtered = filtered.filter((p) =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter((p) => getCategoryName(p.category) === categoryFilter);
    }

    if (stockFilter === 'in') {
      filtered = filtered.filter((p) => p.stock > 0);
    } else if (stockFilter === 'out') {
      filtered = filtered.filter((p) => p.stock === 0);
    }

    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'name': return a.title.localeCompare(b.title);
        case 'price-asc': return a.price - b.price;
        case 'price-desc': return b.price - a.price;
        case 'stock-asc': return a.stock - b.stock;
        case 'stock-desc': return b.stock - a.stock;
        default: return 0;
      }
    });

    return filtered;
  }, [data, searchTerm, categoryFilter, stockFilter, sortBy]);

  const totalPages = Math.ceil(filteredAndSortedProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredAndSortedProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const resetPage = () => setCurrentPage(1);

  if (isLoading) return <div className="flex items-center justify-center py-20 text-xl text-gray-600">Loading...</div>;
  if (error) return <div className="flex items-center justify-center py-20 text-xl text-red-600">Error loading products.</div>;

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto max-w-6xl p-4 md:p-6 space-y-6">
          {/* === MAIN HEADER CONTAINER === */}
          <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
            {/* === MAIN ROW: Left (Title), Middle (Search), Right (Add Button) === */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Left: Product Management Title */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
                <p className="text-sm text-gray-600 mt-2">{filteredAndSortedProducts.length} product(s)</p>
              </div>

              {/* Middle: Search Input (Centered in the row) */}
              <div className="flex-1 max-w-md mx-auto lg:mx-0">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Search products by name..."
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); resetPage(); }}
                    className="pl-12 w-full h-12 text-base border-gray-300 focus:border-black"
                  />
                </div>
              </div>

              {/* Right: Add Product Button */}
              <div className="flex-shrink-0">
                <Button
                  onClick={() => navigate('createproduct')}
                  className="bg-black text-white shadow-md whitespace-nowrap"
                  size="lg"
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Add New Product
                </Button>
              </div>
            </div>
                        {/* === FILTERS & SORTING ROW (Above everything - Left: Filters, Right: View Toggle) === */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2 flex-1">
                {/* Sort */}
                <Select value={sortBy} onValueChange={(v) => { setSortBy(v); resetPage(); }}>
                  <SelectTrigger className="w-40 h-10 text-sm">
                    <SelectValue placeholder="Sort" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name (A-Z)</SelectItem>
                    <SelectItem value="price-asc">Price (Low)</SelectItem>
                    <SelectItem value="price-desc">Price (High)</SelectItem>
                    <SelectItem value="stock-asc">Stock (Low)</SelectItem>
                    <SelectItem value="stock-desc">Stock (High)</SelectItem>
                  </SelectContent>
                </Select>

                {/* Category Filter */}
                <Select value={categoryFilter} onValueChange={(v) => { setCategoryFilter(v); resetPage(); }}>
                  <SelectTrigger className="w-44 h-10 text-sm">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat === 'all' ? 'All Categories' : cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Stock Filter */}
                <Select value={stockFilter} onValueChange={(v) => { setStockFilter(v); resetPage(); }}>
                  <SelectTrigger className="w-36 h-10 text-sm">
                    <SelectValue placeholder="Stock" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="in">In Stock</SelectItem>
                    <SelectItem value="out">Out of Stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* View Toggle (List/Grid) - On the right side */}
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

          {/* Render AllProduct Component (Displays the products data) */}
          <AllProduct
            viewMode={viewMode}
            paginatedProducts={paginatedProducts}
            onProductClick={setSelectedProduct}
            onActionClick={setActionProduct}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            selectedProduct={selectedProduct}
            setSelectedProduct={setSelectedProduct}
            actionProduct={actionProduct}
            setActionProduct={setActionProduct}
            getCategoryName={getCategoryName}
            truncateText={truncateText}
          />

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
        </div>
      </div>
    </>
  );
};

export default AdminProduct;