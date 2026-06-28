import { cn } from '@/shared/lib/cn';
import avatar1 from '@/assets/avatars/avatar-1.png';
import avatar2 from '@/assets/avatars/avatar-2.png';
import avatar3 from '@/assets/avatars/avatar-3.png';
import avatar4 from '@/assets/avatars/avatar-4.png';
import avatar5 from '@/assets/avatars/avatar-5.png';
import avatar6 from '@/assets/avatars/avatar-6.png';
import avatar7 from '@/assets/avatars/avatar-7.png';
import avatar8 from '@/assets/avatars/avatar-8.png';
import avatar9 from '@/assets/avatars/avatar-9.png';
import avatar10 from '@/assets/avatars/avatar-10.png';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg';

interface UserAvatarProps {
  name: string;
  avatarUrl?: string;
  /** 1~10 고정 일러스트 지정 (미지정 시 이름 기반 자동 선택) */
  avatarId?: number;
  size?: AvatarSize;
  className?: string;
}

const sizeStyles: Record<AvatarSize, string> = {
  xs: 'h-6 w-6',
  sm: 'h-8 w-8',
  md: 'h-9 w-9',
  lg: 'h-12 w-12',
};

/** Figma 디자인 시스템 기본 일러스트 아바타 10종 */
const DEFAULT_AVATARS = [
  avatar1,
  avatar2,
  avatar3,
  avatar4,
  avatar5,
  avatar6,
  avatar7,
  avatar8,
  avatar9,
  avatar10,
];

const pickByName = (name: string) => {
  const sum = [...name].reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return DEFAULT_AVATARS[sum % DEFAULT_AVATARS.length];
};

export const UserAvatar = ({ name, avatarUrl, avatarId, size = 'md', className }: UserAvatarProps) => {
  const src =
    avatarUrl ??
    (avatarId ? DEFAULT_AVATARS[(avatarId - 1) % DEFAULT_AVATARS.length] : pickByName(name));

  return (
    <img
      src={src}
      alt={name}
      className={cn('shrink-0 rounded-full bg-gray-100 object-cover', sizeStyles[size], className)}
    />
  );
};
