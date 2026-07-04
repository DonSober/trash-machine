"use client";

import {
  cloneElement,
  forwardRef,
  isValidElement,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import {
  type ButtonColor,
  type ButtonShape,
  type ButtonSize,
  type ButtonVariant,
  getButtonDataProps,
} from "@/components/ui/button/button.types";
import {
  mergeRefs,
  useForcePressRef,
} from "@/components/ui/button/button.utils";
import { ButtonSpinner } from "@/components/ui/button/button-spinner";

export interface ButtonProps
  extends Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    "color" | "prefix"
  > {
  active?: boolean;
  children?: ReactNode;
  color?: ButtonColor;
  loading?: boolean;
  prefix?: ReactNode;
  render?: ReactElement;
  shape?: ButtonShape;
  size?: ButtonSize;
  suffix?: ReactNode;
  variant?: ButtonVariant;
}

function ButtonInner({
  prefix,
  suffix,
  loading = false,
  children,
}: {
  prefix?: ReactNode;
  suffix?: ReactNode;
  loading?: boolean;
  children?: ReactNode;
}) {
  return (
    <>
      {prefix ? (
        <span className="tm-button__prefix">
          <span className="tm-button__prefix-content">{prefix}</span>
        </span>
      ) : null}
      {children ? <span className="tm-button__content">{children}</span> : null}
      {loading ? <ButtonSpinner visible={loading} /> : null}
      {suffix ? <span className="tm-button__suffix">{suffix}</span> : null}
    </>
  );
}

export const Button = forwardRef<HTMLElement, ButtonProps>(function Button(
  {
    variant = "solid",
    color = "accent",
    size = "medium",
    shape = "square",
    loading = false,
    disabled = false,
    active = false,
    prefix,
    suffix,
    render,
    children,
    onClick,
    type = "button",
    ...rest
  },
  ref
) {
  const forcePressRef = useForcePressRef<HTMLElement>();
  const isDisabled = disabled;
  const dataProps = getButtonDataProps({
    variant,
    color,
    size,
    shape,
    loading,
    disabled: isDisabled,
    active,
  });

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    if (loading || isDisabled) {
      event.preventDefault();
      return;
    }
    onClick?.(event as MouseEvent<HTMLButtonElement>);
  };

  const inner = (
    <ButtonInner loading={loading} prefix={prefix} suffix={suffix}>
      {children}
    </ButtonInner>
  );

  if (render && isValidElement(render)) {
    const renderProps = render.props as { ref?: React.Ref<HTMLElement> };
    return cloneElement(render, {
      ...rest,
      ...dataProps,
      ref: mergeRefs(ref, forcePressRef, renderProps.ref),
      onClick: handleClick,
      "aria-busy": loading || undefined,
      "aria-disabled": isDisabled || loading || undefined,
      children: inner,
    } as Record<string, unknown>);
  }

  return (
    <button
      {...rest}
      {...dataProps}
      aria-busy={loading || undefined}
      disabled={isDisabled}
      onClick={handleClick}
      ref={mergeRefs(ref, forcePressRef)}
      type={type}
    >
      {inner}
    </button>
  );
});
