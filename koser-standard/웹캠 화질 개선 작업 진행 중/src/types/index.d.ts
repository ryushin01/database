export type ChangeInputType = (event: ChangeEvent<HTMLInputElement>) => void;

export type ResponsiveType = {
  isMobile?: boolean;
  isTablet?: boolean;
  isDesktop?: boolean;
  isPortrait?: boolean;
  isLandscape?: boolean;
}