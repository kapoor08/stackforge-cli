import Link from 'next/link';

export default function Page() {
  return (
    <main>
      <h1>Welcome to {{projectName}}</h1>
      <ul>
        {{links}}
      </ul>
    </main>
  );
}
