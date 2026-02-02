import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

interface SortablePackageCardProps {
  id: string;
  children: React.ReactNode;
}

const SortablePackageCard: React.FC<SortablePackageCardProps> = ({ id, children }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative">
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 left-2 z-10 p-1.5 bg-white/90 border rounded-md cursor-grab active:cursor-grabbing hover:bg-gray-100 transition-colors shadow-sm"
        title="Drag to reorder"
      >
        <GripVertical size={16} className="text-gray-500" />
      </div>
      {children}
    </div>
  );
};

export default SortablePackageCard;
