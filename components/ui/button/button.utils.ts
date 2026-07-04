import {
  type Ref,
  type RefCallback,
  type RefObject,
  useCallback,
  useRef,
} from "react";

export function mergeRefs<T>(
  ...refs: Array<Ref<T> | undefined>
): RefCallback<T> {
  return (value) => {
    for (const ref of refs) {
      if (typeof ref === "function") {
        ref(value);
      } else if (ref && typeof ref === "object") {
        (ref as RefObject<T | null>).current = value;
      }
    }
  };
}

export function useForcePressRef<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  const setRef = useCallback((node: T | null) => {
    if (ref.current) {
      ref.current.removeEventListener("webkitmouseforcedown", onForceDown);
      ref.current.removeEventListener("webkitmouseforceup", onForceUp);
    }
    ref.current = node;
    if (node) {
      node.addEventListener("webkitmouseforcedown", onForceDown);
      node.addEventListener("webkitmouseforceup", onForceUp);
    }
  }, []);

  return setRef;
}

function onForceDown(this: HTMLElement) {
  this.setAttribute("data-force-press", "true");
}

function onForceUp(this: HTMLElement) {
  this.removeAttribute("data-force-press");
}

declare global {
  interface HTMLElementEventMap {
    webkitmouseforcedown: MouseEvent;
    webkitmouseforceup: MouseEvent;
  }
}
