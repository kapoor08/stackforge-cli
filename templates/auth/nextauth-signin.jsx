export default function SignInPage() {
  return (
    <main>
      <h1>Sign in</h1>
      <p>
        Use the default NextAuth sign-in:
        <a href="/api/auth/signin"> /api/auth/signin</a>
      </p>
      <p>
        Sign out:
        <a href="/api/auth/signout"> /api/auth/signout</a>
      </p>
    </main>
  );
}
