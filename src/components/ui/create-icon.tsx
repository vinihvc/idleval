import type React from "react";
import { cn } from "@/lib/cn";

export interface IconProps extends Omit<React.SVGProps<SVGSVGElement>, "path"> {
  /**
   * If the has a single path, simply copy the path's `d` attribute
   */
  d?: string;
  /**
   * Default props automatically passed to the component; overwriteable
   */
  defaultProps?: React.SVGProps<SVGSVGElement>;
  /**
   * The `svg` path or group element
   * @type React.ReactElement | React.ReactElement[]
   */
  path?: React.ReactElement | React.ReactElement[];
  /**
   * The icon title
   */
  title?: string;
  /**
   * The icon `svg` viewBox
   * @default "0 0 24 24"
   */
  viewBox?: string;
}

export const createIcon = ({
  viewBox = "0 0 24 24",
  path,
  title,
  className: iconClassName,
  d: pathDefinition,
  defaultProps,
}: IconProps) => {
  const defaults = {
    width: "1rem",
    height: "1rem",
    ...defaultProps,
  };

  const Comp = (props: IconProps) => {
    const { path: unusedPath, className, ...rest } = props;

    return (
      <svg
        className={cn("inline-flex", iconClassName, className)}
        viewBox={viewBox}
        {...defaults}
        {...rest}
      >
        <title>{title}</title>
        {path ?? <path d={pathDefinition} fill="currentColor" />}
      </svg>
    );
  };

  return Comp;
};
