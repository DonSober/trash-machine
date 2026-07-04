import { GeistSans } from "geist/font/sans";
import "./app.css";

export const metadata = {
  title: "Trash Machine",
  description: "Interactive React prototype library with GSAP",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className={`dark font-sans ${GeistSans.variable}`} lang="en">
      <head>
        <link href="https://rsms.me/" rel="preconnect" />
        <link href="https://rsms.me/inter/inter.css" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
