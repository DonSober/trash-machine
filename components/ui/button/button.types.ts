export const BUTTON_VARIANTS = ["solid", "soft", "ghost", "outline"] as const;
export const BUTTON_COLORS = [
  "accent",
  "blue",
  "red",
  "amber",
  "black",
] as const;
export const BUTTON_SIZES = [
  "micro",
  "tiny",
  "small",
  "medium",
  "large",
] as const;
export const BUTTON_SHAPES = ["square", "round"] as const;

export type ButtonVariant = (typeof BUTTON_VARIANTS)[number];
export type ButtonColor = (typeof BUTTON_COLORS)[number];
export type ButtonSize = (typeof BUTTON_SIZES)[number];
export type ButtonShape = (typeof BUTTON_SHAPES)[number];

export interface ButtonDataProps {
  "data-active"?: "true" | "false";
  "data-color": ButtonColor;
  "data-disabled": "true" | "false";
  "data-force-press"?: "true" | "false";
  "data-icon"?: "true" | "false";
  "data-loading": "true" | "false";
  "data-shape": ButtonShape;
  "data-size": ButtonSize;
  "data-tm-button": true;
  "data-variant": ButtonVariant;
}

export function getButtonDataProps({
  variant,
  color,
  size,
  shape,
  loading,
  disabled,
  active,
  forcePress,
  icon,
}: {
  variant: ButtonVariant;
  color: ButtonColor;
  size: ButtonSize;
  shape: ButtonShape;
  loading: boolean;
  disabled: boolean;
  active?: boolean;
  forcePress?: boolean;
  icon?: boolean;
}): ButtonDataProps {
  return {
    "data-tm-button": true,
    "data-variant": variant,
    "data-color": color,
    "data-size": size,
    "data-shape": shape,
    "data-loading": loading ? "true" : "false",
    "data-disabled": disabled ? "true" : "false",
    ...(active ? { "data-active": "true" as const } : {}),
    ...(forcePress ? { "data-force-press": "true" as const } : {}),
    ...(icon ? { "data-icon": "true" as const } : {}),
  };
}
