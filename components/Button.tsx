import type React from "react"
import { StyleSheet, TouchableOpacity, Text, ActivityIndicator, type ViewStyle, type TextStyle } from "react-native"
import { COLORS, FONTS } from "../constants/theme"

interface ButtonProps {
  title: string
  onPress: () => void
  variant?: "primary" | "secondary" | "outline"
  loading?: boolean
  disabled?: boolean
  style?: ViewStyle
  textStyle?: TextStyle
  icon?: React.ReactNode
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  loading = false,
  disabled = false,
  style,
  textStyle,
  icon,
}) => {
  const getButtonStyles = () => {
    if (disabled) {
      return [styles.button, styles.disabled, style]
    }

    switch (variant) {
      case "secondary":
        return [styles.button, styles.secondaryButton, style]
      case "outline":
        return [styles.button, styles.outlineButton, style]
      default:
        return [styles.button, styles.primaryButton, style]
    }
  }

  const getTextStyles = () => {
    switch (variant) {
      case "outline":
        return [styles.text, styles.outlineText, textStyle]
      default:
        return [styles.text, textStyle]
    }
  }

  return (
    <TouchableOpacity style={getButtonStyles()} onPress={onPress} disabled={disabled || loading} activeOpacity={0.7}>
      {loading ? (
        <ActivityIndicator color={variant === "outline" ? COLORS.primary : COLORS.white} size="small" />
      ) : (
        <>
          {icon}
          <Text style={getTextStyles()}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    height: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    flexDirection: "row",
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
  },
  secondaryButton: {
    backgroundColor: COLORS.secondary,
  },
  outlineButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  disabled: {
    backgroundColor: COLORS.secondary,
    opacity: 0.5,
  },
  text: {
    ...FONTS.h4,
    color: COLORS.white,
    marginLeft: 8,
  },
  outlineText: {
    color: COLORS.text,
  },
})

export default Button
