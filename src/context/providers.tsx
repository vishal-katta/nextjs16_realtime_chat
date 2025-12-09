"use client";

import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RealtimeProvider } from "@upstash/realtime/client";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import { useState } from "react";
import ThemeDataProvider from "./theme-data-provider";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <NextThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ThemeDataProvider>
        <RealtimeProvider>
          <QueryClientProvider client={queryClient}>
            {children}
            <Toaster />
          </QueryClientProvider>
        </RealtimeProvider>
      </ThemeDataProvider>
    </NextThemeProvider>
  );
};
