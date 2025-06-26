import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head />
      <body>
        <Main />
        <NextScript />
        {/* Ethers.js CDN for global window.ethers */}
        <script src="https://cdn.jsdelivr.net/npm/ethers@6.8.1/dist/ethers.umd.min.js"></script>
      </body>
    </Html>
  );
} 