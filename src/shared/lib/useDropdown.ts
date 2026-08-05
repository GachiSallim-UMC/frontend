import { useCallback, useEffect, useRef, useState } from 'react';

interface UseDropdownOptions {
  /** 메뉴 최대 높이. 아래 공간이 이보다 좁으면 위로 펼칩니다. */
  menuMaxHeight?: number;
}

/**
 * 드롭다운 열림 상태와 바깥 클릭·Escape 닫기, 펼침 방향을 관리합니다.
 * 필터/폼 드롭다운이 같은 동작을 갖도록 이 훅을 공유합니다.
 */
export const useDropdown = ({ menuMaxHeight = 0 }: UseDropdownOptions = {}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropUp, setDropUp] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  /** 뷰포트와 스크롤 조상 중 더 좁은 아래 공간을 기준으로 방향을 정합니다. */
  const updateDirection = useCallback(() => {
    if (!menuMaxHeight) return;
    const element = containerRef.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    let bottomBoundary = window.innerHeight;
    for (let parent = element.parentElement; parent; parent = parent.parentElement) {
      const { overflowY } = getComputedStyle(parent);
      if (overflowY === 'auto' || overflowY === 'scroll' || overflowY === 'hidden') {
        bottomBoundary = Math.min(bottomBoundary, parent.getBoundingClientRect().bottom);
      }
    }

    const spaceBelow = bottomBoundary - rect.bottom;
    setDropUp(spaceBelow < menuMaxHeight && rect.top > spaceBelow);
  }, [menuMaxHeight]);

  const open = useCallback(() => {
    updateDirection();
    setIsOpen(true);
  }, [updateDirection]);

  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => (isOpen ? close() : open()), [close, isOpen, open]);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    // 열린 뒤 스크롤·리사이즈로 남은 공간이 달라지면 방향을 다시 계산합니다.
    window.addEventListener('scroll', updateDirection, true);
    window.addEventListener('resize', updateDirection);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('scroll', updateDirection, true);
      window.removeEventListener('resize', updateDirection);
    };
  }, [isOpen, updateDirection]);

  return { isOpen, dropUp, containerRef, open, close, toggle };
};
