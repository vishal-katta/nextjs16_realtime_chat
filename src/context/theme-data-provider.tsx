"use client";
import setGlobalColorTheme from "@/lib/theme-colors";
import { useTheme, type ThemeProviderProps } from "next-themes";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
} from "react";

const ThemeContext = createContext<ThemeColorStateParams>(
  {} as ThemeColorStateParams,
);

function useThemeColorStore() {
  const subscribe = useCallback((onStoreChange: () => void) => {
    const handler = (e: StorageEvent) => {
      if (e.key === "themeColor") onStoreChange();
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const getSnapshot = useCallback(
    () => (localStorage.getItem("themeColor") as ThemeColors) || "Default",
    [],
  );

  const getServerSnapshot = useCallback(() => "Default" as ThemeColors, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

function useIsMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export default function ThemeDataProvider({ children }: ThemeProviderProps) {
  const isMounted = useIsMounted();
  const storedThemeColor = useThemeColorStore();
  const { resolvedTheme } = useTheme();

  const setThemeColor = useCallback((color: ThemeColors) => {
    localStorage.setItem("themeColor", color);
    window.dispatchEvent(
      new StorageEvent("storage", { key: "themeColor", newValue: color }),
    );
  }, []);

  useEffect(() => {
    if (isMounted) {
      setGlobalColorTheme(resolvedTheme as "light" | "dark", storedThemeColor);
    }
  }, [storedThemeColor, resolvedTheme, isMounted]);

  if (!isMounted) {
    return null;
  }

  return (
    <ThemeContext.Provider
      value={{ themeColor: storedThemeColor, setThemeColor }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  return useContext(ThemeContext);
}