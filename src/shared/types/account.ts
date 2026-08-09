export interface AccountProfile {
  userId: string | number;
  name: string;
  nickname: string;
  email: string;
  profileImage?: string | null;
}

export const isAccountProfile = (value: unknown): value is AccountProfile => {
  if (typeof value !== 'object' || value === null) return false;

  const profile = value as Record<string, unknown>;
  return (
    (typeof profile.userId === 'string' || typeof profile.userId === 'number') &&
    typeof profile.name === 'string' &&
    typeof profile.nickname === 'string' &&
    typeof profile.email === 'string' &&
    (profile.profileImage === undefined ||
      profile.profileImage === null ||
      typeof profile.profileImage === 'string')
  );
};
