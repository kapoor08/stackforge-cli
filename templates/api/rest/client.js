export async function fetchHello() {
  const res = await fetch('/api/hello');
  return res.json();
}
