import React from 'react';
import { iconsMap, IconName } from '@/src/assets/icons/iconsMap'; // your SVG imports

type IconProps = {
  /** The name of the icon (must exist in iconsMap). */
  name: IconName;
  /** Optional CSS class name. Can include Tailwind text-{color} and stroke-{color} classes */
  className?: string;
};

/**
 * Reusable Icon component
 */
export function Icon({ name, className }: IconProps) {
  const SvgIcon = iconsMap[name];

  return (
    <SvgIcon aria-hidden="true" className={`${className} stroke-current`} />
  );
}
