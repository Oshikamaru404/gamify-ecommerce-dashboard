
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
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ChevronDown, 
  Search, 
  FileEdit, 
  Eye, 
  FileText,
  ShoppingCart 
} from 'lucide-react';
import { orders } from '@/lib/mockData';
import { Order, OrderStatus, PaymentStatus } from '@/lib/types';
import { format, parseISO } from 'date-fns';
import { toast } from 'sonner';

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [paymentFilter, setPaymentFilter] = useState<PaymentStatus | 'all'>('all');
  
  // Filter orders based on search term and filters
  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      searchTerm === '' || 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesPayment = paymentFilter === 'all' || order.paymentStatus === paymentFilter;
    
    return matchesSearch && matchesStatus && matchesPayment;
  });
  
  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    toast.success(`Order ${orderId} status updated to ${newStatus}`);
  };
  
  const handlePaymentStatusChange = (orderId: string, newStatus: PaymentStatus) => {
    toast.success(`Order ${orderId} payment status updated to ${newStatus}`);
  };
  
  const getOrderStatusBadge = (status: OrderStatus) => {
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
        return null;
    }
  };
  
  const getPaymentStatusBadge = (status: PaymentStatus) => {
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
        return null;
    }
  };
  
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy');
    } catch (error) {
      return dateString;
    }
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
              <Select 
                value={statusFilter} 
                onValueChange={(value) => setStatusFilter(value as OrderStatus | 'all')}
              >
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
              
              <Select 
                value={paymentFilter} 
                onValueChange={(value) => setPaymentFilter(value as PaymentStatus | 'all')}
              >
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{order.customerName}</div>
                        <div className="text-xs text-muted-foreground">{order.customerEmail}</div>
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(order.createdAt)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 p-0">
                            {getOrderStatusBadge(order.status)}
                            <ChevronDown className="ml-2 h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                          <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'pending')}>
                            Pending
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'processing')}>
                            Processing
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'shipped')}>
                            Shipped
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'delivered')}>
                            Delivered
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'cancelled')}>
                            Cancelled
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 p-0">
                            {getPaymentStatusBadge(order.paymentStatus)}
                            <ChevronDown className="ml-2 h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                          <DropdownMenuItem onClick={() => handlePaymentStatusChange(order.id, 'pending')}>
                            Pending
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handlePaymentStatusChange(order.id, 'paid')}>
                            Paid
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handlePaymentStatusChange(order.id, 'failed')}>
                            Failed
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handlePaymentStatusChange(order.id, 'refunded')}>
                            Refunded
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                    <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" title="View Order">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
                <ShoppingCart size={28} className="text-red-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">No IPTV orders found</h3>
              <p className="mb-4 mt-2 text-sm text-muted-foreground">
                No orders match your current search criteria.
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setPaymentFilter('all');
                }}
              >
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
