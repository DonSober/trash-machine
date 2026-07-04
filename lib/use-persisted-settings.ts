"use client";

import { useCallback, useEffect, useState } from "react";

export function usePersistedSettings<T extends object>(
  slug: string,
  defaults: T
): [T, (key: keyof T, value: T[keyof T]) => void, () => void, () => void] {
  const storageKey = `trash-machine.${slug}.settings`;

  const [settings, setSettings] = useState<T>(defaults);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) {
        setSettings({ ...defaults, ...JSON.parse(raw) });
      }
    } catch {
      /* ignore corrupt storage */
    }
  }, [storageKey]);

  const onChange = useCallback((key: keyof T, value: T[keyof T]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }, []);

  const save = useCallback(() => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(settings));
    } catch {
      /* ignore quota errors */
    }
  }, [settings, storageKey]);

  const reset = useCallback(() => {
    setSettings(defaults);
    try {
      window.localStorage.removeItem(storageKey);
    } catch {
      /* ignore */
    }
  }, [defaults, storageKey]);

  return [settings, onChange, save, reset];
}
