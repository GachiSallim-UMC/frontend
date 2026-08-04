const MOBILE_BOTTOM_NAVIGATION_PATHS = [
  '/dashboard',
  '/chores',
  '/expenses',
  '/messenger',
] as const;

export const isMobileBottomNavigationPath = (pathname: string) =>
  MOBILE_BOTTOM_NAVIGATION_PATHS.some(path => path === pathname);
