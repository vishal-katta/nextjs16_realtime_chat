type ThemeColors = "Default" | "Darkmatter" | "NeoBrutalism" | "Doom64" | "KodamaGrove" | "Bubblegum" | "Claude" | "MochaMousse" | "Nature" | "Notebook" | "Perpetuity" | "RetroArcade" | "SageGarden" | "Supabase" | "VintagePaper" | "Twitter";

interface ThemeColorStateParams {
    themeColor: ThemeColors;
    setThemeColor: (color: ThemeColors) => void;
}