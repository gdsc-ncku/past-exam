import React from 'react';
import { iconsMap, IconName } from '@/ui/iconsMap'; // your SVG imports

type IconProps = {
  /** The name of the icon (must exist in iconsMap). */
  name: IconName;
  /** Optional CSS class name. Can include Tailwind text-{color} and stroke-{color} classes */
  className?: string;
  /** Size in pixels. Will be applied to both width and height. */
  size?: number;
};

/**
 * Reusable Icon component
 */
export function Icon({ name, className, size = 24 }: IconProps) {
  const SvgIcon = iconsMap[name];

  return (
    <SvgIcon
      aria-hidden="true"
      className={`${className} stroke-current`}
      width={size}
      height={size}
      viewBox="0 0 36 36"
    />
  );
}
