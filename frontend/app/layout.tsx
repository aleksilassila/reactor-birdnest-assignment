"use client";
import "./global.css";
import React from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body className="min-h-screen flex flex-col bg-zinc-900 text-zinc-200">
        {children}
      </body>
    </html>
  );
}
