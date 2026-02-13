'use client';

import { useEffect, useState } from 'react';
import { fetchHello } from './client';

export function RestExample() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchHello().then((data) => setMessage(data.message));
  }, []);

  return <p>REST says: {message}</p>;
}
