import Document, { Head, Html, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head />
        <body>
          {/* Here we will mount our modal portal */}
          <div id="portal" />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
