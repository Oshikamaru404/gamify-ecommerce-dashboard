
import React from 'react';
import { Tv, Film, Video, Play, Laptop, Globe } from 'lucide-react';
import ServiceCategory from './ServiceCategory';

const PlatformSection = () => {
  const categories = [
    { icon: Tv, name: 'Chaînes Live', bgColor: 'bg-gradient-to-br from-[#ff4d4d] to-[#ff6b6b]', iconColor: 'text-white' },
    { icon: Film, name: 'Films', bgColor: 'bg-gradient-to-br from-[#ff6b6b] to-[#ff8585]', iconColor: 'text-white' },
    { icon: Video, name: 'Séries', bgColor: 'bg-gradient-to-br from-[#ff4d4d] to-[#ff6b6b]', iconColor: 'text-white' },
    { icon: Play, name: 'Sports', bgColor: 'bg-gradient-to-br from-[#ff6b6b] to-[#ff8585]', iconColor: 'text-white' },
    { icon: Laptop, name: 'VOD', bgColor: 'bg-gradient-to-br from-[#ff4d4d] to-[#ff6b6b]', iconColor: 'text-white' },
    { icon: Globe, name: 'International', bgColor: 'bg-gradient-to-br from-[#ff6b6b] to-[#ff8585]', iconColor: 'text-white' }
  ];

  return (
    <div className="flex justify-center gap-6 py-10 px-4 overflow-x-auto">
      {categories.map((category) => (
        <ServiceCategory
          key={category.name}
          icon={category.icon}
          name={category.name}
          bgColor={category.bgColor}
          iconColor={category.iconColor}
        />
      ))}
    </div>
  );
};

export default PlatformSection;
