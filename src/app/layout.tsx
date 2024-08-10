import { Providers } from "@/components";
import type { Metadata } from "next";
import "@/styles/_globals.scss"


export const metadata: Metadata = {
  title: "Som' Sweet",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
