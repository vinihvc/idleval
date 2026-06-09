import { tv, type VariantProps } from "tailwind-variants";

const boxBorderVariants = tv({
  base: [
    "[--box-border-edge-active:2px] [--box-border-edge-hover:4px] [--box-border-edge:3px]",
    "[--box-border-soft-y-active:4px] [--box-border-soft-y-hover:8px] [--box-border-soft-y:6px]",
    "[--box-border-soft-blur-active:10px] [--box-border-soft-blur-hover:18px] [--box-border-soft-blur:14px]",
    "[--box-border-edge-color:oklch(0.55_0.12_75)] [--box-border-soft-color:oklch(0.12_0.02_55/0.4)]",
  ],
  variants: {
    variant: {
      default: [
        "[--box-border-edge-color:oklch(0.65_0.12_75)]",
        "[--box-border-soft-color:oklch(0.12_0.02_55/0.35)]",
      ],
      muted: [
        "[--box-border-edge-color:oklch(0.12_0.02_55/0.35)]",
        "[--box-border-soft-color:oklch(0.12_0.02_55/0.22)]",
      ],
      cream: [
        "[--box-border-edge-color:oklch(0.72_0.14_85)]",
        "[--box-border-soft-color:oklch(0.45_0.12_85/0.45)]",
        "[--box-border-ring-color:oklch(0.72_0.14_85/0.45)]",
      ],
      brown: [
        "[--box-border-edge-color:oklch(0.55_0.12_75)]",
        "[--box-border-soft-color:oklch(0.12_0.02_55/0.4)]",
        "[--box-border-edge-color-hover:oklch(0.58_0.13_78)]",
        "[--box-border-soft-color-hover:oklch(0.12_0.02_55/0.48)]",
        "[--box-border-edge-color-active:oklch(0.55_0.12_75)]",
        "[--box-border-soft-color-active:oklch(0.12_0.02_55/0.32)]",
      ],
      green: [
        "[--box-border-edge-color:oklch(0.32_0.14_145)]",
        "[--box-border-soft-color:oklch(0.30_0.12_145/0.5)]",
        "[--box-border-edge-color-hover:oklch(0.28_0.14_145)]",
        "[--box-border-soft-color-hover:oklch(0.30_0.12_145/0.55)]",
        "[--box-border-edge-color-active:oklch(0.24_0.13_145)]",
        "[--box-border-soft-color-active:oklch(0.25_0.10_145/0.4)]",
      ],
      stone: [
        "[--box-border-edge-color:oklch(0.38_0.02_260)]",
        "[--box-border-soft-color:oklch(0.12_0.02_55/0.35)]",
        "[--box-border-edge-color-hover:oklch(0.42_0.02_260)]",
        "[--box-border-soft-color-hover:oklch(0.12_0.02_55/0.42)]",
        "[--box-border-edge-color-active:oklch(0.34_0.02_260)]",
        "[--box-border-soft-color-active:oklch(0.12_0.02_55/0.28)]",
      ],
      blue: [
        "[--box-border-edge-color:oklch(0.35_0.1_250)]",
        "[--box-border-soft-color:oklch(0.12_0.02_55/0.35)]",
      ],
      purple: [
        "[--box-border-edge-color:oklch(0.35_0.1_298)]",
        "[--box-border-soft-color:oklch(0.12_0.02_55/0.35)]",
      ],
      red: [
        "[--box-border-edge-color:oklch(0.35_0.12_27)]",
        "[--box-border-soft-color:oklch(0.12_0.02_55/0.35)]",
      ],
    },
    size: {
      sm: [
        "[--box-border-edge-active:2px] [--box-border-edge-hover:3px] [--box-border-edge:2px]",
        "[--box-border-soft-y-active:3px] [--box-border-soft-y-hover:6px] [--box-border-soft-y:4px]",
        "[--box-border-soft-blur-active:8px] [--box-border-soft-blur-hover:14px] [--box-border-soft-blur:10px]",
      ],
      md: "",
      lg: [
        "[--box-border-edge-active:3px] [--box-border-edge-hover:5px] [--box-border-edge:4px]",
        "[--box-border-soft-y-active:6px] [--box-border-soft-y-hover:10px] [--box-border-soft-y:8px]",
        "[--box-border-soft-blur-active:12px] [--box-border-soft-blur-hover:22px] [--box-border-soft-blur:18px]",
      ],
    },
    soft: {
      true: "shadow-[0_var(--box-border-edge)_0_var(--box-border-edge-color),0_var(--box-border-soft-y)_var(--box-border-soft-blur)_var(--box-border-soft-color)]",
      false: "shadow-[0_var(--box-border-edge)_0_var(--box-border-edge-color)]",
      none: "",
    },
    interactive: {
      true: [
        "hover:shadow-[0_var(--box-border-edge-hover)_0_var(--box-border-edge-color-hover),0_var(--box-border-soft-y-hover)_var(--box-border-soft-blur-hover)_var(--box-border-soft-color-hover)]",
        "active:shadow-[0_var(--box-border-edge-active)_0_var(--box-border-edge-color-active),0_var(--box-border-soft-y-active)_var(--box-border-soft-blur-active)_var(--box-border-soft-color-active)]",
      ],
    },
    interactiveOnly: {
      true: [
        "hover:shadow-[0_var(--box-border-edge-hover)_0_var(--box-border-edge-color-hover),0_var(--box-border-soft-y-hover)_var(--box-border-soft-blur-hover)_var(--box-border-soft-color-hover)]",
        "active:shadow-[0_var(--box-border-edge-active)_0_var(--box-border-edge-color-active),0_var(--box-border-soft-y-active)_var(--box-border-soft-blur-active)_var(--box-border-soft-color-active)]",
      ],
    },
    intensity: {
      default: "",
      subtle: "[--box-border-edge-color:oklch(0.65_0.12_75/0.55)]",
    },
    inset: {
      none: "",
      sm: "shadow-[inset_0_1px_3px_var(--box-border-soft-color)]",
      md: "shadow-[inset_0_2px_5px_var(--box-border-soft-color)]",
      lg: "shadow-[inset_0_3px_8px_var(--box-border-soft-color)]",
      well: "shadow-[inset_0_2px_8px_var(--box-border-soft-color)]",
      highlight: "shadow-[inset_0_1px_0_oklch(1_0_0/0.06)]",
    },
    ring: {
      true: "shadow-[0_0_0_2px_var(--box-border-ring-color,var(--box-border-edge-color))]",
    },
  },
  defaultVariants: {
    variant: "brown",
    size: "md",
    soft: true,
    interactive: false,
    interactiveOnly: false,
    intensity: "default",
    inset: "none",
    ring: false,
  },
});

export type BoxBorderProps = VariantProps<typeof boxBorderVariants>;

export const boxBorder = (props?: BoxBorderProps) => {
  const {
    interactiveOnly = false,
    interactive = false,
    soft = true,
    ...rest
  } = props ?? {};

  if (interactiveOnly) {
    return boxBorderVariants({
      ...rest,
      interactiveOnly: true,
      interactive: false,
      soft: "none",
    });
  }

  return boxBorderVariants({
    ...rest,
    soft,
    interactive,
    interactiveOnly: false,
  });
};
