// AdminCategory.jsx - View toggle positioned on right side of filters row
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFetchAllCategoriesQuery } from '../../../redux/api/categoryAPI';
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
import AllCategories from './AllCategories';

const ITEMS_PER_PAGE = 12;

const AdminCategory = () => {
  const navigate = useNavigate();
  const { data: categoriesData, isLoading, isError, refetch } = useFetchAllCategoriesQuery();

  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [parentFilter, setParentFilter] = useState('all');

  const handleAddCategory = () => {
    navigate('create-category');
  };

  const resetPage = () => setCurrentPage(1);

  // Filter and sort categories
  const filteredAndSortedCategories = useMemo(() => {
    let filtered = categoriesData?.data || [];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter((category) =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Parent filter
    if (parentFilter !== 'all') {
      if (parentFilter === 'none') {
        filtered = filtered.filter((category) => !category.parentCategory);
      } else {
        filtered = filtered.filter((category) => category.parentCategory);
      }
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return filtered;
  }, [categoriesData, searchTerm, parentFilter, sortBy]);

  const totalPages = Math.ceil(filteredAndSortedCategories.length / ITEMS_PER_PAGE);
  const paginatedCategories = filteredAndSortedCategories.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleEdit = (id) => {
    navigate(`/admin/categories/edit-category/${id}`);
  };

  if (isLoading) return <div className="flex items-center justify-center py-20 text-xl text-gray-600">Loading...</div>;
  if (isError) return <div className="flex items-center justify-center py-20 text-xl text-red-600">Error loading categories.</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto max-w-6xl p-4 md:p-6 space-y-6">
        {/* === MAIN HEADER CONTAINER === */}
        <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
          {/* === MAIN ROW: Left (Title), Middle (Search), Right (Add Button) === */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Left: Category Management Title */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">Category Management</h1>
              <p className="text-sm text-gray-600 mt-2">{filteredAndSortedCategories.length} category(s)</p>
            </div>

            {/* Middle: Search Input (Centered in the row) */}
            <div className="flex-1 max-w-md mx-auto lg:mx-0">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search categories by name..."
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); resetPage(); }}
                  className="pl-12 w-full h-12 text-base border-gray-300 focus:border-black"
                />
              </div>
            </div>

            {/* Right: Add Category Button */}
            <div className="flex-shrink-0">
              <Button
                onClick={handleAddCategory}
                className="bg-black text-white shadow-md whitespace-nowrap"
                size="lg"
              >
                <Plus className="mr-2 h-5 w-5" />
                Add New Category
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
                </SelectContent>
              </Select>

              {/* Parent Filter */}
              <Select value={parentFilter} onValueChange={(v) => { setParentFilter(v); resetPage(); }}>
                <SelectTrigger className="w-44 h-10 text-sm">
                  <SelectValue placeholder="Parent" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Parents</SelectItem>
                  <SelectItem value="none">No Parent</SelectItem>
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

        {/* Render AllCategories Component */}
        <AllCategories
          paginatedCategories={paginatedCategories}
          viewMode={viewMode}
          onEdit={handleEdit}
          refetch={refetch}
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
  );
};

export default AdminCategory;