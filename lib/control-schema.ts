export const GSAP_EASES = [
  "none",
  "power1.in",
  "power1.out",
  "power1.inOut",
  "power2.in",
  "power2.out",
  "power2.inOut",
  "power3.in",
  "power3.out",
  "power3.inOut",
  "power4.in",
  "power4.out",
  "power4.inOut",
  "back.in",
  "back.out",
  "back.inOut",
  "elastic.in",
  "elastic.out",
  "elastic.inOut",
  "bounce.in",
  "bounce.out",
  "bounce.inOut",
  "circ.in",
  "circ.out",
  "circ.inOut",
  "expo.in",
  "expo.out",
  "expo.inOut",
  "sine.in",
  "sine.out",
  "sine.inOut",
] as const;

export type GsapEase = (typeof GSAP_EASES)[number];

export type ControlField<T extends object> =
  | {
      type: "range";
      key: keyof T & string;
      label: string;
      min: number;
      max: number;
      step?: number;
    }
  | {
      type: "toggle";
      key: keyof T & string;
      label: string;
    }
  | {
      type: "color";
      key: keyof T & string;
      label: string;
    }
  | {
      type: "select";
      key: keyof T & string;
      label: string;
      options: readonly string[];
    }
  | {
      type: "ease";
      key: keyof T & string;
      label: string;
    }
  | {
      type: "action";
      key: string;
      label: string;
    };

export interface ControlGroup<T extends object> {
  controls: ControlField<T>[];
  title: string;
}

export type ControlValue = number | string | boolean;
