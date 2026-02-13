'use server';

export async function exampleAction(formData) {
  const name = String(formData.get('name') || 'world');
  console.log(`Hello ${name}`);
}
