import { useEffect, useState } from 'react';

export default function useFetch(
  url: string,
  options?: any,
): { data: any | undefined; isLoading: boolean; error: any | undefined } {
  const [data, setData] = useState(undefined);
  const [error, setError] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(url, options)
      .then((resp) => resp.json())
      .then((resp) => setData(resp))
      .catch((err) => setError(err))
      .finally(() => setIsLoading(false));
  }, [url]);

  return { data, isLoading, error };
}
