// useLocalStorage.js
import { useState, useEffect } from "react";
export function useLocalStorage(key, init) {
  const [val, setVal] = useState(() => {
    try {
      const fromStorage = window.localStorage.getItem(key);
      return fromStorage !== null ? JSON.parse(fromStorage) : init;
    } catch { return init; }
  });
  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(val));
  }, [key, val]);
  return [val, setVal];
}
