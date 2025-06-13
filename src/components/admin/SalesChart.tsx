
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { format, subDays, parseISO, startOfDay } from 'date-fns';
import { TimeRange } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

type SalesChartProps = {
  className?: string;
  title?: string;
};

const SalesChart: React.FC<SalesChartProps> = ({ 
  className, 
  title = "Sales Overview" 
}) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('week');
  
  const { data: salesData = [], isLoading } = useQuery({
    queryKey: ['sales-chart-data', timeRange],
    queryFn: async () => {
      console.log('Fetching sales data for chart...');
      
      const today = new Date();
      let daysToSubtract: number;
      
      switch (timeRange) {
        case 'day':
          daysToSubtract = 1;
          break;
        case 'week':
          daysToSubtract = 7;
          break;
        case 'month':
          daysToSubtract = 30;
          break;
        case 'year':
          daysToSubtract = 365;
          break;
        default:
          daysToSubtract = 7;
      }
      
      const startDate = subDays(today, daysToSubtract);
      
      // Fetch orders within the date range
      const { data: orders, error } = await supabase
        .from('orders')
        .select('*')
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true });
      
      if (error) {
        console.error('Error fetching orders for chart:', error);
        throw error;
      }
      
      // Group orders by date and calculate revenue
      const dailySales = new Map<string, { revenue: number; orders: number }>();
      
      // Initialize all dates with zero values
      for (let i = 0; i <= daysToSubtract; i++) {
        const date = subDays(today, daysToSubtract - i);
        const dateKey = format(startOfDay(date), 'yyyy-MM-dd');
        dailySales.set(dateKey, { revenue: 0, orders: 0 });
      }
      
      // Process orders and calculate daily metrics
      orders.forEach(order => {
        const orderDate = format(startOfDay(new Date(order.created_at || '')), 'yyyy-MM-dd');
        const existing = dailySales.get(orderDate) || { revenue: 0, orders: 0 };
        
        if (order.payment_status === 'paid') {
          existing.revenue += Number(order.amount);
          existing.orders += 1;
        } else if (order.payment_status === 'refunded') {
          existing.revenue -= Number(order.amount);
          existing.orders -= 1;
        }
        
        dailySales.set(orderDate, existing);
      });
      
      // Convert to chart data format
      const chartData = Array.from(dailySales.entries()).map(([date, data]) => ({
        date,
        revenue: data.revenue,
        orders: data.orders
      }));
      
      console.log('Sales chart data calculated:', chartData);
      return chartData;
    },
  });

  const formatDate = (dateStr: string) => {
    const date = parseISO(dateStr);
    return format(date, 'MMM dd');
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-base font-normal">{title}</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-[300px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-normal">{title}</CardTitle>
        <Tabs defaultValue={timeRange} onValueChange={(value) => setTimeRange(value as TimeRange)}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="day">Day</TabsTrigger>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="year">Year</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="p-0 pt-2">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={salesData}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate} 
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                tickFormatter={(value) => `€${value}`} 
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                formatter={(value) => [`€${value}`, 'Revenue']}
                labelFormatter={formatDate}
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="hsl(var(--primary))" 
                fillOpacity={1} 
                fill="url(#colorRevenue)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesChart;
