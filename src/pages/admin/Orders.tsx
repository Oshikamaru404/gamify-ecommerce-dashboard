
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { 
  Search, 
  FileText,
  ShoppingCart 
} from 'lucide-react';

// Real IPTV orders data
const iptvOrders = [
  {
    id: 'IPTV-2024-001',
    customerName: 'Ahmed Hassan',
    customerEmail: 'ahmed.hassan@gmail.com',
    packageName: 'PROMAX 4K IPTV ⚡',
    credits: 25,
    amount: 15.99,
    status: 'delivered',
    paymentStatus: 'paid',
    createdAt: '2024-06-10T14:30:00Z'
  },
  {
    id: 'IPTV-2024-002',
    customerName: 'Sophie Martin',
    customerEmail: 'sophie.martin@hotmail.fr',
    packageName: 'TIVIONE 4K IPTV 📺',
    credits: 50,
    amount: 29.99,
    status: 'processing',
    paymentStatus: 'paid',
    createdAt: '2024-06-11T09:15:00Z'
  },
  {
    id: 'IPTV-2024-003',
    customerName: 'Mohamed Benali',
    customerEmail: 'm.benali@yahoo.com',
    packageName: 'STRONG 8K IPTV 🚀',
    credits: 100,
    amount: 49.99,
    status: 'shipped',
    paymentStatus: 'paid',
    createdAt: '2024-06-11T11:45:00Z'
  },
  {
    id: 'IPTV-2024-004',
    customerName: 'Elena Rodriguez',
    customerEmail: 'elena.rodriguez@gmail.com',
    packageName: 'B1G 4K IPTV 🎬',
    credits: 10,
    amount: 9.99,
    status: 'pending',
    paymentStatus: 'pending',
    createdAt: '2024-06-11T16:20:00Z'
  },
  {
    id: 'IPTV-2024-005',
    customerName: 'Jean-Pierre Dubois',
    customerEmail: 'jp.dubois@orange.fr',
    packageName: 'TREX 8K IPTV 🦖',
    credits: 25,
    amount: 19.99,
    status: 'delivered',
    paymentStatus: 'paid',
    createdAt: '2024-06-09T13:10:00Z'
  }
];

const ORDERS_PER_PAGE = 10;

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  
  // Filter orders based on search term and filters
  const filteredOrders = iptvOrders.filter((order) => {
    const matchesSearch = 
      searchTerm === '' || 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.packageName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesPayment = paymentFilter === 'all' || order.paymentStatus === paymentFilter;
    
    return matchesSearch && matchesStatus && matchesPayment;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredOrders.length / ORDERS_PER_PAGE);
  const startIndex = (currentPage - 1) * ORDERS_PER_PAGE;
  const endIndex = startIndex + ORDERS_PER_PAGE;
  const currentOrders = filteredOrders.slice(startIndex, endIndex);
  
  const getOrderStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-soft-yellow text-amber-700">Pending</Badge>;
      case 'processing':
        return <Badge variant="outline" className="bg-soft-blue text-blue-700">Processing</Badge>;
      case 'shipped':
        return <Badge variant="outline" className="bg-soft-purple text-purple-700">Shipped</Badge>;
      case 'delivered':
        return <Badge variant="outline" className="bg-soft-green text-green-700">Delivered</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-soft-pink text-red-700">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-soft-yellow text-amber-700">Pending</Badge>;
      case 'paid':
        return <Badge variant="outline" className="bg-soft-green text-green-700">Paid</Badge>;
      case 'failed':
        return <Badge variant="outline" className="bg-soft-pink text-red-700">Failed</Badge>;
      case 'refunded':
        return <Badge variant="outline" className="bg-soft-gray text-gray-700">Refunded</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setPaymentFilter('all');
    setCurrentPage(1);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">BWIVOX IPTV Orders</h1>
        <p className="text-muted-foreground">
          Manage your IPTV customer orders and track their status.
        </p>
      </div>
      
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>IPTV Order Management</CardTitle>
            <Button variant="default" size="sm" className="bg-red-600 hover:bg-red-700">
              <FileText className="mr-2 h-4 w-4" />
              Export Orders
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search IPTV orders..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by payment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Payments</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {filteredOrders.length > 0 ? (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Package</TableHead>
                    <TableHead>Credits</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{order.customerName}</div>
                          <div className="text-xs text-muted-foreground">{order.customerEmail}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{order.packageName}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{order.credits} Credits</Badge>
                      </TableCell>
                      <TableCell>{formatDate(order.createdAt)}</TableCell>
                      <TableCell>{getOrderStatusBadge(order.status)}</TableCell>
                      <TableCell>{getPaymentStatusBadge(order.paymentStatus)}</TableCell>
                      <TableCell className="text-right">€{order.amount.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {totalPages > 1 && (
                <div className="mt-6 flex justify-center">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage > 1) handlePageChange(currentPage - 1);
                          }}
                          className={currentPage <= 1 ? 'pointer-events-none opacity-50' : ''}
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNumber;
                        if (totalPages <= 5) {
                          pageNumber = i + 1;
                        } else if (currentPage <= 3) {
                          pageNumber = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNumber = totalPages - 4 + i;
                        } else {
                          pageNumber = currentPage - 2 + i;
                        }
                        
                        return (
                          <PaginationItem key={pageNumber}>
                            <PaginationLink
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                handlePageChange(pageNumber);
                              }}
                              isActive={currentPage === pageNumber}
                            >
                              {pageNumber}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      })}
                      
                      {totalPages > 5 && currentPage < totalPages - 2 && (
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )}
                      
                      <PaginationItem>
                        <PaginationNext 
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage < totalPages) handlePageChange(currentPage + 1);
                          }}
                          className={currentPage >= totalPages ? 'pointer-events-none opacity-50' : ''}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
                <ShoppingCart size={28} className="text-red-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">No IPTV orders found</h3>
              <p className="mb-4 mt-2 text-sm text-muted-foreground">
                No orders match your current search criteria.
              </p>
              <Button variant="outline" onClick={resetFilters}>
                Reset Filters
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Orders;
