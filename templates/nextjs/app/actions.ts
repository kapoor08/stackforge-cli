'use server';

export async function exampleAction(formData: FormData) {
  const name = String(formData.get('name') || 'world');
  console.log(`Hello ${name}`);
}
