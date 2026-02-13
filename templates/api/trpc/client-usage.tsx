'use client';

import { useEffect, useState } from 'react';
import { fetchHello, trpcClient } from './client';

export function TrpcExample() {
  const [message, setMessage] = useState('');
  const [created, setCreated] = useState('');

  useEffect(() => {
    fetchHello().then((data) => setMessage(data));
  }, []);

  async function handleCreate() {
    const user = await trpcClient.addUser.mutate({ name: 'Ada' });
    setCreated(user.name);
  }

  return (
    <div>
      <p>tRPC says: {message}</p>
      <button onClick={handleCreate}>Create user</button>
      {created ? <p>Created: {created}</p> : null}
    </div>
  );
}
