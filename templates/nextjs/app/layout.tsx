{{importCss}}{{providersImport}}export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{{wrapChildren}}</body>
    </html>
  );
}