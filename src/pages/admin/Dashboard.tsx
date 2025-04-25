
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MetricCard from '@/components/admin/MetricCard';
import SalesChart from '@/components/admin/SalesChart';
import RecentOrdersTable from '@/components/admin/RecentOrdersTable';
import { metrics, orders } from '@/lib/mockData';
import { TimeRange } from '@/lib/types';

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('week');
  
  // Filter orders for the recent orders table
  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            An overview of your store performance and sales.
          </p>
        </div>
        <Tabs defaultValue={timeRange} onValueChange={(value) => setTimeRange(value as TimeRange)}>
          <TabsList>
            <TabsTrigger value="day">Today</TabsTrigger>
            <TabsTrigger value="week">This Week</TabsTrigger>
            <TabsTrigger value="month">This Month</TabsTrigger>
            <TabsTrigger value="year">This Year</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => (
          <MetricCard key={index} metric={metric} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        <SalesChart className="lg:col-span-5" />
        
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Top Selling</CardTitle>
            <CardDescription>Your best performing products this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...orders]
                .sort((a, b) => b.total - a.total)
                .slice(0, 3)
                .map((order) => {
                  const topItem = order.items[0];
                  return (
                    <div key={order.id} className="flex items-center gap-3">
                      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border">
                        <img 
                          src={topItem.product.imageUrl} 
                          alt={topItem.product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {topItem.product.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {topItem.product.platform.charAt(0).toUpperCase() + 
                            topItem.product.platform.slice(1)}
                        </p>
                        <p className="text-sm font-medium">
                          ${(topItem.product.salePrice || topItem.product.price).toFixed(2)}
                        </p>
                      </div>
                      <div className="rounded-full bg-soft-green px-2 py-1 text-xs font-semibold text-green-700">
                        {topItem.quantity} sold
                      </div>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      </div>

      <RecentOrdersTable orders={recentOrders} />
    </div>
  );
};

export default Dashboard;
