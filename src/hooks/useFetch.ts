import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

interface FetchState<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useFetch = <T>(url: string): FetchState<T> => {
  const [state, setState] = useState<Omit<FetchState<T>, 'refetch'>>({
    data: [],
    loading: true,
    error: null,
  });

  const fetchData = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await axios.get(url);
      setState({
        data: response.data,
        loading: false,
        error: null,
      });
    } catch (err) {
      console.error(`Ошибка загрузки данных: ${err}`);
      setState({
        data: [],
        loading: false,
        error: 'Ошибка при загрузке данных',
      });
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    ...state,
    refetch: fetchData
  };
}; 