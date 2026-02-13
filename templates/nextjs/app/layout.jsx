{{importCss}}{{providersImport}}export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{{wrapChildren}}</body>
    </html>
  );
}