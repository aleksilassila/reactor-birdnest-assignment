"use client";
import "./global.css";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import React from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      // refetchOnMount: false,
      // refetchOnReconnect: false,
      retry: 3,
      suspense: true,
    },
  },
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <head>
        <title>Birdnest Assignment</title>
      </head>
      <body className="min-h-screen flex flex-col bg-zinc-900 text-zinc-200">
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </body>
    </html>
  );
}
