"use client";

import { Button } from "@/components/motion/button/base";
import { RangeSlider } from "@/components/motion/range-slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/motion/select";
import { Switch } from "@/components/motion/switch";
import {
  type ControlField,
  type ControlGroup,
  type ControlValue,
  GSAP_EASES,
} from "@/lib/control-schema";
import { cn } from "@/lib/utils";

interface ControlPanelProps<T extends object> {
  className?: string;
  onAction?: (action: string) => void;
  onChange: (key: keyof T, value: T[keyof T]) => void;
  onReset: () => void;
  onSave: () => void;
  schema: ControlGroup<T>[];
  settings: T;
}

export function ControlPanel<T extends object>({
  schema,
  settings,
  onChange,
  onSave,
  onReset,
  onAction,
  className,
}: ControlPanelProps<T>) {
  return (
    <aside
      className={cn(
        "flex w-[280px] shrink-0 flex-col border-border border-l bg-card",
        className
      )}
    >
      <ControlPanelHeader onReset={onReset} onSave={onSave} />
      <ControlPanelFields
        onAction={onAction}
        onChange={onChange}
        schema={schema}
        settings={settings}
      />
    </aside>
  );
}

export function ControlPanelHeader({
  onSave,
  onReset,
}: {
  onSave: () => void;
  onReset: () => void;
}) {
  return (
    <div className="flex items-center justify-between border-border border-b px-4 py-3">
      <span className="font-medium text-foreground text-sm">Controls</span>
      <div className="flex gap-1">
        <Button onClick={onSave} size="sm" type="button" variant="ghost">
          Save
        </Button>
        <Button onClick={onReset} size="sm" type="button" variant="ghost">
          Reset
        </Button>
      </div>
    </div>
  );
}

export function ControlPanelFields<T extends object>({
  schema,
  settings,
  onChange,
  onAction,
  className,
}: {
  schema: ControlGroup<T>[];
  settings: T;
  onChange: (key: keyof T, value: T[keyof T]) => void;
  onAction?: (action: string) => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-1 flex-col gap-5 overflow-y-auto p-4",
        className
      )}
    >
      {schema.map((group) => (
        <section className="flex flex-col gap-3" key={group.title}>
          <h3 className="font-medium text-[11px] text-muted-foreground uppercase tracking-wide">
            {group.title}
          </h3>
          {group.controls.map((ctl) => (
            <ControlFieldRow
              ctl={ctl}
              key={`${group.title}-${ctl.type === "action" ? ctl.key : ctl.key}`}
              onAction={onAction}
              onChange={onChange}
              value={
                ctl.type === "action"
                  ? undefined
                  : (settings[ctl.key] as ControlValue)
              }
            />
          ))}
        </section>
      ))}
    </div>
  );
}

function ControlFieldRow<T extends object>({
  ctl,
  value,
  onChange,
  onAction,
}: {
  ctl: ControlField<T>;
  value: ControlValue | undefined;
  onChange: (key: keyof T, value: T[keyof T]) => void;
  onAction?: (action: string) => void;
}) {
  if (ctl.type === "action") {
    return (
      <div>
        <Button
          onClick={() => onAction?.(ctl.key)}
          size="sm"
          type="button"
          variant="outline"
        >
          {ctl.label}
        </Button>
      </div>
    );
  }

  if (ctl.type === "toggle") {
    return (
      <Switch
        checked={value as boolean}
        label={ctl.label}
        onCheckedChange={(checked) => onChange(ctl.key, checked as T[keyof T])}
      />
    );
  }

  if (ctl.type === "color") {
    return (
      <label className="flex flex-col gap-2">
        <span className="text-muted-foreground text-xs">{ctl.label}</span>
        <input
          className="h-9 w-full cursor-pointer rounded-lg border border-border bg-background"
          onChange={(e) => onChange(ctl.key, e.target.value as T[keyof T])}
          type="color"
          value={value as string}
        />
      </label>
    );
  }

  if (ctl.type === "select" || ctl.type === "ease") {
    const options = ctl.type === "ease" ? GSAP_EASES : ctl.options;
    return (
      <div className="flex flex-col gap-2">
        <span className="text-muted-foreground text-xs">{ctl.label}</span>
        <Select
          onValueChange={(v) => onChange(ctl.key, v as T[keyof T])}
          value={value as string}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {options.map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  if (ctl.type === "range") {
    const step = ctl.step ?? 0.01;
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-muted-foreground text-xs">{ctl.label}</span>
          <span className="font-mono text-foreground text-xs">
            {formatValue(value)}
          </span>
        </div>
        <RangeSlider
          aria-label={ctl.label}
          max={ctl.max}
          min={ctl.min}
          onValueChange={(v) => onChange(ctl.key, v as T[keyof T])}
          step={step}
          value={value as number}
        />
      </div>
    );
  }

  return null;
}

function formatValue(value: ControlValue | undefined): string {
  if (typeof value === "number") {
    return value.toFixed(2);
  }
  return String(value ?? "");
}
