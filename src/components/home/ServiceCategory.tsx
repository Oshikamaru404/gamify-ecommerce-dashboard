
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

type ServiceCategoryProps = {
  icon: LucideIcon;
  name: string;
  bgColor: string;
  iconColor: string;
};

const ServiceCategory: React.FC<ServiceCategoryProps> = ({ icon: Icon, name, bgColor, iconColor }) => (
  <Link to={`/products?category=${name.toLowerCase()}`}>
    <div className={cn(
      "group flex flex-col items-center rounded-xl p-8 transition-all hover:shadow-[0_8px_32px_rgba(255,77,77,0.4)] cursor-pointer min-w-40 transform hover:scale-105",
      bgColor
    )}>
      <Icon className={cn("h-12 w-12 mb-4 group-hover:scale-125 transition-transform", iconColor)} />
      <span className="text-base font-bold text-white">{name}</span>
    </div>
  </Link>
);

export default ServiceCategory;
