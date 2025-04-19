import { useState, useEffect } from 'react';

export const useFilter = <T>(
  items: T[],
  filterKey: keyof T,
  initialFilter: string = 'Все'
) => {
  const [filter, setFilter] = useState<string>(initialFilter);
  const [filteredItems, setFilteredItems] = useState<T[]>(items);

  useEffect(() => {
    const filtered = items.filter((item) => {
      return filter === 'Все' || item[filterKey] === filter;
    });
    
    setFilteredItems(filtered);
  }, [filter, items, filterKey]);

  const handleFilterChange = (value: string) => {
    setFilter(value);
  };

  return { filter, filteredItems, handleFilterChange };
}; 