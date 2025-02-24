import AlertCircle from '@/assets/icons/alert-circle.svg';
import ArrowDownCircle from '@/assets/icons/arrow-down-circle.svg';
import ArrowDownLeft from '@/assets/icons/arrow-down-left.svg';
import ArrowDownRight from '@/assets/icons/arrow-down-right.svg';
import ArrowDown from '@/assets/icons/arrow-down.svg';
import ArrowLeftCircle from '@/assets/icons/arrow-left-circle.svg';
import ArrowLeftRight from '@/assets/icons/arrow-left-right.svg';
import ArrowLeft from '@/assets/icons/arrow-left.svg';
import ArrowRightCircle from '@/assets/icons/arrow-right-circle.svg';
import ArrowRight from '@/assets/icons/arrow-right.svg';
import ArrowUpCircle from '@/assets/icons/arrow-up-circle.svg';
import ArrowUpDown from '@/assets/icons/arrow-up-down.svg';
import ArrowUpLeft from '@/assets/icons/arrow-up-left.svg';
import ArrowUpRight from '@/assets/icons/arrow-up-right.svg';
import ArrowUp from '@/assets/icons/arrow-up.svg';
import Asterisk from '@/assets/icons/asterisk.svg';
import Award from '@/assets/icons/award.svg';
import Axis3d from '@/assets/icons/axis-3d.svg';
import CalendarCheck2 from '@/assets/icons/calendar-check-2.svg';
import Calendar from '@/assets/icons/calendar.svg';
import CheckCheck from '@/assets/icons/check-check.svg';
import CheckCircle2 from '@/assets/icons/check-circle-2.svg';
import CheckCircle from '@/assets/icons/check-circle.svg';
import CheckSquare from '@/assets/icons/check-square.svg';
import Check from '@/assets/icons/check.svg';
import ChevronDown from '@/assets/icons/chevron-down.svg';
import ChevronFirst from '@/assets/icons/chevron-first.svg';
import ChevronLast from '@/assets/icons/chevron-last.svg';
import ChevronLeft from '@/assets/icons/chevron-left.svg';
import ChevronRight from '@/assets/icons/chevron-right.svg';
import ChevronUp from '@/assets/icons/chevron-up.svg';
import CornerDownLeft from '@/assets/icons/corner-down-left.svg';
import CornerDownRight from '@/assets/icons/corner-down-right.svg';
import CornerLeftDown from '@/assets/icons/corner-left-down.svg';
import CornerLeftUp from '@/assets/icons/corner-left-up.svg';
import CornerRightDown from '@/assets/icons/corner-right-down.svg';
import CornerRightUp from '@/assets/icons/corner-right-up.svg';
import CornerUpLeft from '@/assets/icons/corner-up-left.svg';
import CornerUpRight from '@/assets/icons/corner-up-right.svg';
import Download from '@/assets/icons/download.svg';
import ExternalLink from '@/assets/icons/external-link.svg';
import Github from '@/assets/icons/github.svg';
import GripHorizontal from '@/assets/icons/grip-horizontal.svg';
import GripVertical from '@/assets/icons/grip-vertical.svg';
import Heart from '@/assets/icons/heart.svg';
import Import from '@/assets/icons/import.svg';
import MoreHorizontal from '@/assets/icons/more-horizontal.svg';
import StickyNote from '@/assets/icons/sticky-note.svg';
import User from '@/assets/icons/user.svg';
import XCircle from '@/assets/icons/x-circle.svg';
import XOctagon from '@/assets/icons/x-octagon.svg';
import XSquare from '@/assets/icons/x-square.svg';
import X from '@/assets/icons/x.svg';
import ZoomIn from '@/assets/icons/zoom-in.svg';
import ZoomOut from '@/assets/icons/zoom-out.svg';
import BookMark from '@/assets/icons/bookmark.svg';
import BookMarkBlack from '@/assets/icons/bookmark-1.svg';
import Plus from '@/assets/icons/plus.svg';
import Logo from '@/assets/icons/logo.svg';
import Setting from '@/assets/icons/settings.svg';
import Upload from '@/assets/icons/upload.svg';
import Login from '@/assets/icons/log-in.svg';
import Logout from '@/assets/icons/log-out.svg';
import Star from '@/assets/icons/star.svg';

export const iconsMap = {
  logo: Logo,
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
  asterisk: Asterisk,
  award: Award,
  'axis-3d': Axis3d,
  'bookmark-1': BookMarkBlack,
  bookmark: BookMark,
  'calendar-check-2': CalendarCheck2,
  calendar: Calendar,
  'check-check': CheckCheck,
  'check-circle-2': CheckCircle2,
  'check-circle': CheckCircle,
  'check-square': CheckSquare,
  check: Check,
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
  download: Download,
  'external-link': ExternalLink,
  github: Github,
  'grip-horizontal': GripHorizontal,
  'grip-vertical': GripVertical,
  heart: Heart,
  import: Import,
  'more-horizontal': MoreHorizontal,
  plus: Plus,
  'sticky-note': StickyNote,
  user: User,
  'x-circle': XCircle,
  'x-octagon': XOctagon,
  'x-square': XSquare,
  x: X,
  'zoom-in': ZoomIn,
  'zoom-out': ZoomOut,
  setting: Setting,
  upload: Upload,
  login: Login,
  logout: Logout,
  star: Star,
};

export type IconName = keyof typeof iconsMap;
