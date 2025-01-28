import React from 'react';
import AlertCircle from './alert-circle.svg';
import ArrowDownCircle from './arrow-down-circle.svg';
import ArrowDownLeft from './arrow-down-left.svg';
import ArrowDownRight from './arrow-down-right.svg';
import ArrowDown from './arrow-down.svg';
import ArrowLeftCircle from './arrow-left-circle.svg';
import ArrowLeftRight from './arrow-left-right.svg';
import ArrowLeft from './arrow-left.svg';
import ArrowRightCircle from './arrow-right-circle.svg';
import ArrowRight from './arrow-right.svg';
import ArrowUpCircle from './arrow-up-circle.svg';
import ArrowUpDown from './arrow-up-down.svg';
import ArrowUpLeft from './arrow-up-left.svg';
import ArrowUpRight from './arrow-up-right.svg';
import ArrowUp from './arrow-up.svg';
import Asterisk from './asterisk.svg';
import Award from './award.svg';
import Axis3d from './axis-3d.svg';
import CalendarCheck2 from './calendar-check-2.svg';
import Calendar from './calendar.svg';
import CheckCheck from './check-check.svg';
import CheckCircle2 from './check-circle-2.svg';
import CheckCircle from './check-circle.svg';
import CheckSquare from './check-square.svg';
import Check from './check.svg';
import ChevronDown from './chevron-down.svg';
import ChevronFirst from './chevron-first.svg';
import ChevronLast from './chevron-last.svg';
import ChevronLeft from './chevron-left.svg';
import ChevronRight from './chevron-right.svg';
import ChevronUp from './chevron-up.svg';
import CornerDownLeft from './corner-down-left.svg';
import CornerDownRight from './corner-down-right.svg';
import CornerLeftDown from './corner-left-down.svg';
import CornerLeftUp from './corner-left-up.svg';
import CornerRightDown from './corner-right-down.svg';
import CornerRightUp from './corner-right-up.svg';
import CornerUpLeft from './corner-up-left.svg';
import CornerUpRight from './corner-up-right.svg';
import Download from './download.svg';
import ExternalLink from './external-link.svg';
import Github from './github.svg';
import GripHorizontal from './grip-horizontal.svg';
import GripVertical from './grip-vertical.svg';
import Heart from './heart.svg';
import Import from './import.svg';
import MoreHorizontal from './more-horizontal.svg';
import StickyNote from './sticky-note.svg';
import User from './user.svg';
import XCircle from './x-circle.svg';
import XOctagon from './x-octagon.svg';
import XSquare from './x-square.svg';
import X from './x.svg';
import ZoomIn from './zoom-in.svg';
import ZoomOut from './zoom-out.svg';

export const iconsMap = {
  'alert-circle': AlertCircle,
  'arrow-down-circle': ArrowDownCircle,
  'arrow-down-left': ArrowDownLeft,
  'arrow-down-right': ArrowDownRight,
  'arrow-down': ArrowDown,
  'arrow-left-circle': ArrowLeftCircle,
  'arrow-left-right': ArrowLeftRight,
  'arrow-left': ArrowLeft,
  'arrow-right-circle': ArrowRightCircle,
  'arrow-right': ArrowRight,
  'arrow-up-circle': ArrowUpCircle,
  'arrow-up-down': ArrowUpDown,
  'arrow-up-left': ArrowUpLeft,
  'arrow-up-right': ArrowUpRight,
  'arrow-up': ArrowUp,
  'asterisk': Asterisk,
  'award': Award,
  'axis-3d': Axis3d,
  'calendar-check-2': CalendarCheck2,
  'calendar': Calendar,
  'check-check': CheckCheck,
  'check-circle-2': CheckCircle2,
  'check-circle': CheckCircle,
  'check-square': CheckSquare,
  'check': Check,
  'chevron-down': ChevronDown,
  'chevron-first': ChevronFirst,
  'chevron-last': ChevronLast,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  'chevron-up': ChevronUp,
  'corner-down-left': CornerDownLeft,
  'corner-down-right': CornerDownRight,
  'corner-left-down': CornerLeftDown,
  'corner-left-up': CornerLeftUp,
  'corner-right-down': CornerRightDown,
  'corner-right-up': CornerRightUp,
  'corner-up-left': CornerUpLeft,
  'corner-up-right': CornerUpRight,
  'download': Download,
  'external-link': ExternalLink,
  'github': Github,
  'grip-horizontal': GripHorizontal,
  'grip-vertical': GripVertical,
  'heart': Heart,
  'import': Import,
  'more-horizontal': MoreHorizontal,
  'sticky-note': StickyNote,
  'user': User,
  'x-circle': XCircle,
  'x-octagon': XOctagon,
  'x-square': XSquare,
  'x': X,
  'zoom-in': ZoomIn,
  'zoom-out': ZoomOut,
};

export type IconName = keyof typeof iconsMap;
