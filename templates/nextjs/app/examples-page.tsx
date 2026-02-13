{{imports}}{{uiDemoImport}}import { exampleAction } from '../actions';

export default function ExamplesPage() {
  return (
    <main>
      <h1>API Examples</h1>
      <form action={exampleAction}>
        <input name="name" placeholder="Your name" />
        <button type="submit">Run server action</button>
      </form>
      {{featureNotes}}
      {{components}}
      {{uiDemoComponent}}
    </main>
  );
}
