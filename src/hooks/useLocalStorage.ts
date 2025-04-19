import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  // Получаем начальное значение из localStorage или используем initialValue
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Ошибка при чтении из localStorage (ключ ${key}):`, error);
      return initialValue;
    }
  });

  // Обновляем localStorage при изменении storedValue
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(`Ошибка при записи в localStorage (ключ ${key}):`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue] as const;
} 