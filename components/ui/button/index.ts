// biome-ignore-all lint/performance/noBarrelFile: intentional public entry point for the Button component

import { Button as ButtonRoot } from "@/components/ui/button/button";
import { ButtonIcon } from "@/components/ui/button/button-icon";

export const Button = Object.assign(ButtonRoot, {
  Icon: ButtonIcon,
});

export type { ButtonProps } from "@/components/ui/button/button";
export {
  BUTTON_COLORS,
  BUTTON_SHAPES,
  BUTTON_SIZES,
  BUTTON_VARIANTS,
  type ButtonColor,
  type ButtonShape,
  type ButtonSize,
  type ButtonVariant,
} from "@/components/ui/button/button.types";
export type { ButtonIconProps } from "@/components/ui/button/button-icon";
