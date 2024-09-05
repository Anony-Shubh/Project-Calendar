import React from 'react';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(event.target.value);
  };

  return (
    <div className="mb-4">
      <Input
        type="text"
        placeholder="Search events..."
        onChange={handleSearch}
        className="w-full"
      />
    </div>
  );
};

export default SearchBar;