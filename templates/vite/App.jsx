{{apiImports}}{{uiDemoImport}}export default function App() {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
  return (
    <main>
      <h1>Welcome to {{projectName}}</h1>
      <p>API base: {apiUrl}</p>
      {{featureNotes}}
      {{apiExamples}}
      {{uiDemoComponent}}
    </main>
  );
}
