import { useState } from 'react';
import axios from 'axios';

interface UseDeleteReturn {
  deleteItem: (id: string | number) => Promise<boolean>;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Hook for deleting items from a specified API endpoint
 * @param url - Base API endpoint for the resource
 * @param onSuccess - Optional callback to execute after successful deletion
 */
export const useDelete = (
  url: string,
  onSuccess?: () => void
): UseDeleteReturn => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const deleteItem = async (id: string | number): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      await axios.delete(`${url}/${id}`);
      setIsLoading(false);
      
      if (onSuccess) {
        onSuccess();
      }
      
      return true;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Ошибка при удалении');
      setError(error);
      setIsLoading(false);
      console.error('Ошибка при удалении:', error);
      return false;
    }
  };

  return { deleteItem, isLoading, error };
}; 