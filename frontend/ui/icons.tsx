import React from 'react';
import { iconsMap, IconName } from '@/src/assets/icons/iconsMap'; // your SVG imports
import { DesignSystemColor } from '@/styles/ColorTokens';

type IconProps = {
  /** The name of the icon (must exist in iconsMap). */
  name: IconName;
  /** The color token from the design system. */
  color?: DesignSystemColor;
};

/**
 * Reusable Icon component
 */
export function Icon({ name }: IconProps) {
  const SvgIcon = iconsMap[name];

  return <SvgIcon aria-hidden="true" />;
}
