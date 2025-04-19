import { useState, useEffect } from 'react';
import axios from 'axios';

interface FetchState<T> {
  data: T[];
  loading: boolean;
  error: string | null;
}

export const useFetch = <T>(url: string) => {
  const [state, setState] = useState<FetchState<T>>({
    data: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchData = async () => {
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
    };

    fetchData();
  }, [url]);

  return state;
}; 