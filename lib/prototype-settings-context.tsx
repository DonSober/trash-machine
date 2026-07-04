"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import type { ControlGroup } from "@/lib/control-schema";
import type { PrototypeControlTab } from "@/lib/prototype-control-tabs";
import { usePersistedSettings } from "@/lib/use-persisted-settings";

interface PrototypeSettingsContextValue<T extends object> {
  dispatchAction: (action: string) => void;
  onChange: (key: keyof T, value: T[keyof T]) => void;
  registerActionHandler: (handler: ((action: string) => void) | null) => void;
  reset: () => void;
  save: () => void;
  schema: ControlGroup<T>[];
  settings: T;
  slug: string;
  tabs: PrototypeControlTab[];
}

const PrototypeSettingsContext =
  createContext<PrototypeSettingsContextValue<object> | null>(null);

interface PrototypeSettingsProviderProps<T extends object> {
  children: ReactNode;
  defaults: T;
  schema: ControlGroup<T>[];
  slug: string;
  tabs: PrototypeControlTab[];
}

export function PrototypeSettingsProvider<T extends object>({
  slug,
  defaults,
  schema,
  tabs,
  children,
}: PrototypeSettingsProviderProps<T>) {
  const [settings, onChange, save, reset] = usePersistedSettings(
    slug,
    defaults
  );
  const actionHandlerRef = useRef<((action: string) => void) | null>(null);

  const registerActionHandler = useCallback(
    (handler: ((action: string) => void) | null) => {
      actionHandlerRef.current = handler;
    },
    []
  );

  const dispatchAction = useCallback((action: string) => {
    actionHandlerRef.current?.(action);
  }, []);

  const value = useMemo(
    () =>
      ({
        slug,
        settings,
        schema,
        tabs,
        onChange,
        save,
        reset,
        dispatchAction,
        registerActionHandler,
      }) satisfies PrototypeSettingsContextValue<T>,
    [
      slug,
      settings,
      schema,
      tabs,
      onChange,
      save,
      reset,
      dispatchAction,
      registerActionHandler,
    ]
  );

  return (
    <PrototypeSettingsContext.Provider
      value={value as unknown as PrototypeSettingsContextValue<object>}
    >
      {children}
    </PrototypeSettingsContext.Provider>
  );
}

export function usePrototypeSettings<T extends object>() {
  const ctx = useContext(PrototypeSettingsContext);
  if (!ctx) {
    throw new Error(
      "usePrototypeSettings must be used within PrototypeSettingsProvider"
    );
  }
  return ctx as unknown as PrototypeSettingsContextValue<T>;
}

export function useRegisterPrototypeAction(handler: (action: string) => void) {
  const { registerActionHandler } = usePrototypeSettings();
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    registerActionHandler((action) => handlerRef.current(action));
    return () => registerActionHandler(null);
  }, [registerActionHandler]);
}
