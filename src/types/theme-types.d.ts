type ThemeColors = "Default" | "Darkmatter" | "NeoBrutalism";

interface ThemeColorStateParams {
    themeColor: ThemeColors;
    setThemeColor: (color: ThemeColors) => void;
}

