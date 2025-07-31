"use client";
import React, { createContext, useContext } from "react";
import type { ReactNode, FC } from "react";

interface ThemeContextType {
  colors: {
    n2: string;
    n1: string;
    n3: string;
    primary: string;
    primaryDark: string;
    primaryLight: string;
    primaryRed: string;
    po1: string;
    py1: string;
    secondaryBlue: string;
    tertiaryYellow: string;
    blurWhite: string;
    blurBlack: string;
  };
  fonts: {
    sans: string;
    serif: string;
    allerta: string;
  };
  shadows: {
    themeShadow: string;
  };
  screens: {
    xs: string;
  };
}

const themeValues: ThemeContextType = {
  colors: {
    n2: "#fff9ee",
    n1: "#FFFBF4",
    n3: "#FFF1DD",
    primary: "#004e59",
    primaryDark: "#5E0712",
    primaryLight: "#F8B999",
    primaryRed: "#F86800",
    po1: "#FF8F28",
    py1: "#FFBE3F",
    secondaryBlue: "#406A91",
    tertiaryYellow: "#FCC686",
    blurWhite: "rgba(255, 255, 255, 0.5)",
    blurBlack: "rgba(0, 0, 0, 0.7)",
  },
  fonts: {
    sans: "Montserrat, sans-serif",
    serif: "Playfair, serif",
    allerta: "Allerta, sans-serif",
  },
  shadows: {
    themeShadow: "0 4px 12px rgba(0, 0, 0, 0.8)",
  },
  screens: {
    xs: "460px",
  },
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ThemeContext.Provider value={themeValues}>
      {children}
    </ThemeContext.Provider>
  );
};
