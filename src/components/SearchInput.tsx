import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const SearchInput = () => {
  return (
    <div className="relative">
      <Search className="h-4 w-4 text-gray-400 absolute top-1/2 left-2 transform -translate-y-1/2" />
      <Input
        placeholder="Search conversations..."
        className="w-full pl-8"
      />
    </div>
  );
};

export default SearchInput;