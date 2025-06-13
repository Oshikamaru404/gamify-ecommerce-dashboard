
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
import { salesData } from '@/lib/mockData';
import { format, subDays, parseISO } from 'date-fns';
import { TimeRange } from '@/lib/types';

type SalesChartProps = {
  className?: string;
  title?: string;
};

const SalesChart: React.FC<SalesChartProps> = ({ 
  className, 
  title = "Sales Overview" 
}) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('week');
  
  const getFilteredData = () => {
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
    return salesData.filter(item => {
      const itemDate = parseISO(item.date);
      return itemDate >= startDate;
    });
  };

  const data = getFilteredData();

  const formatDate = (dateStr: string) => {
    const date = parseISO(dateStr);
    return format(date, 'MMM dd');
  };

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
              data={data}
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
                tickFormatter={(value) => `$${value}`} 
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                formatter={(value) => [`$${value}`, 'Revenue']}
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
