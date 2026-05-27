import { useEffect, useState } from 'react';

let cachedDebug: boolean | null = null;

export function useDebug() {
  const [debug, setDebug] = useState(cachedDebug ?? false);

  useEffect(() => {
    if (cachedDebug !== null) return;
    fetch('/api/health')
      .then((r) => r.json())
      .then((data) => {
        cachedDebug = data.debug ?? false;
        setDebug(cachedDebug as boolean);
      })
      .catch(() => {
        cachedDebug = false;
      });
  }, []);

  return debug;
}
