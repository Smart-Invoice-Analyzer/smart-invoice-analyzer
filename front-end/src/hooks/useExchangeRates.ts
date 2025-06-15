// useExchangeRates.ts
import { useState, useEffect } from 'react';
import axios from 'axios';

export const useExchangeRates = (base: string = 'USD') => {
  const [rates, setRates] = useState<Record<string, number>>({});

  useEffect(() => {
    axios
      .get(`https://v6.exchangerate-api.com/v6/837e53339d24261e78357bbb/latest/${base}`)
      .then((res) => setRates(res.data.conversion_rates))
      .catch((err) => console.error("Kur verisi alınamadı:", err));
  }, [base]);

  return rates;
};
