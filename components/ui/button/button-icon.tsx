"use client";

import { forwardRef, type ReactNode } from "react";
import type { ButtonProps } from "@/components/ui/button/button";
import { getButtonDataProps } from "@/components/ui/button/button.types";
import {
  mergeRefs,
  useForcePressRef,
} from "@/components/ui/button/button.utils";

export interface ButtonIconProps
  extends Omit<ButtonProps, "children" | "prefix" | "suffix"> {
  "aria-label": string;
  children: ReactNode;
}

export const ButtonIcon = forwardRef<HTMLElement, ButtonIconProps>(
  function ButtonIcon(
    {
      "aria-label": ariaLabel,
      variant = "soft",
      color = "black",
      size = "medium",
      shape = "round",
      loading = false,
      disabled = false,
      active = false,
      children,
      onClick,
      type = "button",
      ...rest
    },
    ref
  ) {
    const forcePressRef = useForcePressRef<HTMLElement>();
    const dataProps = getButtonDataProps({
      variant,
      color,
      size,
      shape,
      loading,
      disabled,
      active,
      icon: true,
    });

    return (
      <button
        {...rest}
        {...dataProps}
        aria-busy={loading || undefined}
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={(event) => {
          if (loading || disabled) {
            event.preventDefault();
            return;
          }
          onClick?.(event);
        }}
        ref={mergeRefs(ref, forcePressRef)}
        type={type}
      >
        {loading ? (
          <span aria-hidden className="tm-button__spinner" data-visible="true">
            <svg
              aria-hidden="true"
              data-tm-spinner
              fill="none"
              viewBox="0 0 16 16"
            >
              <circle
                cx="8"
                cy="8"
                r="6"
                stroke="currentColor"
                strokeDasharray="10 18"
                strokeLinecap="round"
                strokeWidth="2"
              />
            </svg>
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);
