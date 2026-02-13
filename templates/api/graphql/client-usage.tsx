'use client';

import { useEffect, useState } from 'react';
import { fetchHello } from './client';

export function GraphqlExample() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchHello().then((data) => setMessage(data.hello));
  }, []);

  return <p>GraphQL says: {message}</p>;
}
