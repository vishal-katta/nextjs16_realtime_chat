"use client";

import { useMemo, useState, useEffect } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useThemeContext } from "@/context/theme-data-provider";
import { useTheme } from "next-themes";
import { THEMES } from "@/lib/theme-colors";
import setGlobalColorTheme from "@/lib/theme-colors";

const availableThemeColors = Object.entries(THEMES).map(([key, value]) => ({
  name: key,
  light: {
    primary: value.light.primary,
    accent: value.light.accent,
    secondary: value.light.secondary,
    border: value.light.border,
  },
  dark: {
    primary: value.dark.primary,
    accent: value.dark.accent,
    secondary: value.dark.secondary,
    border: value.dark.border,
  },
}));

export function ThemeColorToggle() {
  const { themeColor, setThemeColor } = useThemeContext();
  const { theme } = useTheme();
  const [hoveredTheme, setHoveredTheme] = useState<ThemeColors | null>(null);

  const paletteMode = theme === "dark" ? "dark" : "light";

  // Apply hovered theme temporarily or revert to current themeColor
  useEffect(() => {
    if (hoveredTheme) {
      // Apply hovered theme preview
      setGlobalColorTheme(paletteMode, hoveredTheme);
    } else {
      // Revert to current themeColor when hover ends
      setGlobalColorTheme(paletteMode, themeColor);
    }
  }, [hoveredTheme, paletteMode, themeColor]);

  const renderSwatches = (palette: Record<string, string>) => (
    <div className="grid grid-cols-4 gap-1">
      {Object.entries(palette).map(([key, value]) => (
        <span
          key={key}
          className="h-4 w-4 rounded-sm border"
          style={{ backgroundColor: value }}
        />
      ))}
    </div>
  );

  const selectItems = useMemo(
    () =>
      availableThemeColors.map(({ name, light, dark }) => {
        const palette = paletteMode === "light" ? light : dark;

        return (
          <SelectItem
            key={name}
            value={name}
            onMouseEnter={() => {
              setHoveredTheme(name as ThemeColors);
            }}
            onMouseLeave={() => {
              setHoveredTheme(null);
            }}
            onSelect={() => {
              // Clear hover state when clicked - setThemeColor will handle the permanent change
              setHoveredTheme(null);
            }}
          >
            <div className="flex items-center gap-3">
              {renderSwatches(palette)}
              <div className="text-sm font-medium">{name}</div>
            </div>
          </SelectItem>
        );
      }),
    [paletteMode]
  );

  const selectedColor = useMemo(
    () =>
      availableThemeColors.find(({ name }) => name === themeColor)?.[
        paletteMode
      ] || null,
    [paletteMode, themeColor]
  );

  return (
    <Select
      onValueChange={(value) => setThemeColor(value as ThemeColors)}
      value={themeColor}
    >
      <SelectTrigger
        className="ring-offset-transparent focus:ring-transparent"
      >
        {selectedColor ? (
          <div className="flex items-center gap-2">
            {renderSwatches(selectedColor)}
          </div>
        ) : (
          <SelectValue placeholder="Select Color" />
        )}
      </SelectTrigger>
      <SelectContent className="border-muted">
        {selectItems}
      </SelectContent>
    </Select>
  );
}
