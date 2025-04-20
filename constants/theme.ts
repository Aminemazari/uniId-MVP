import { Dimensions } from "react-native"

const { width, height } = Dimensions.get("window")

export const COLORS = {
  primary: "#6d28d9",
  primaryLight: "#8b5cf6",
  primaryDark: "#4c1d95",
  secondary: "#f3f4f6",
  white: "#FFFFFF",
  black: "#000000",
  text: "#1f2937",
  textLight: "#6b7280",
  background: "#f9fafb",
  card: "#FFFFFF",
  border: "#e5e7eb",
  success: "#10b981",
  error: "#ef4444",
  warning: "#f59e0b",
  info: "#3b82f6",
}

export const SIZES = {
  // Global sizes
  base: 8,
  font: 14,
  radius: 12,
  padding: 24,

  // Font sizes
  largeTitle: 40,
  h1: 30,
  h2: 22,
  h3: 18,
  h4: 16,
  h5: 14,
  body1: 30,
  body2: 22,
  body3: 16,
  body4: 14,
  body5: 12,

  // App dimensions
  width,
  height,
}

export const FONTS = {
  largeTitle: { fontSize: SIZES.largeTitle, fontWeight: "bold" },
  h1: { fontSize: SIZES.h1, fontWeight: "bold" },
  h2: { fontSize: SIZES.h2, fontWeight: "bold" },
  h3: { fontSize: SIZES.h3, fontWeight: "bold" },
  h4: { fontSize: SIZES.h4, fontWeight: "bold" },
  h5: { fontSize: SIZES.h5, fontWeight: "bold" },
  body1: { fontSize: SIZES.body1 },
  body2: { fontSize: SIZES.body2 },
  body3: { fontSize: SIZES.body3 },
  body4: { fontSize: SIZES.body4 },
  body5: { fontSize: SIZES.body5 },
}

const appTheme = { COLORS, SIZES, FONTS }

export default appTheme
