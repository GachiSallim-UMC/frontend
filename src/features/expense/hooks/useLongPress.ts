import { useRef, useCallback } from 'react';

interface UseLongPressOptions {
  onLongPress: () => void;
  onClick?: () => void;
  ms?: number; 
}

export const useLongPress = ({
  onLongPress,
  onClick,
  ms = 500,
}: UseLongPressOptions) => {
  const timeoutId = useRef<number | null>(null);
  const isLongPress = useRef<boolean>(false);

  const start = useCallback(() => {
    isLongPress.current = false;
    timeoutId.current = window.setTimeout(() => {
      isLongPress.current = true;
      onLongPress();
    }, ms);
  }, [onLongPress, ms]);

  const clear = useCallback(() => {
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
      timeoutId.current = null;
    }
    if (!isLongPress.current && onClick) {
      onClick();
    }
  }, [onClick]);

  return {
    onMouseDown: start,
    onMouseUp: clear,
    onMouseLeave: clear,
    onTouchStart: start,
    onTouchEnd: clear,
  };
};