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
  const [availableMenuHeight, setAvailableMenuHeight] = useState(menuMaxHeight);
  const containerRef = useRef<HTMLDivElement>(null);

  /** 뷰포트와 스크롤 조상 중 더 좁은 아래 공간을 기준으로 방향을 정합니다. */
  const updateDirection = useCallback(() => {
    if (!menuMaxHeight) return;
    const element = containerRef.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    let topBoundary = 0;
    let bottomBoundary = window.innerHeight;
    for (let parent = element.parentElement; parent; parent = parent.parentElement) {
      const { overflowY } = getComputedStyle(parent);
      if (overflowY === 'auto' || overflowY === 'scroll' || overflowY === 'hidden') {
        const parentRect = parent.getBoundingClientRect();
        topBoundary = Math.max(topBoundary, parentRect.top);
        bottomBoundary = Math.min(bottomBoundary, parentRect.bottom);
      }
    }

    const spaceAbove = rect.top - topBoundary;
    const spaceBelow = bottomBoundary - rect.bottom;
    const shouldDropUp = spaceBelow < menuMaxHeight && spaceAbove > spaceBelow;
    const availableSpace = shouldDropUp ? spaceAbove : spaceBelow;
    setDropUp(shouldDropUp);
    // 메뉴와 트리거 사이 간격(0.375rem = 6px)을 제외한 실제 공간만 사용해
    // 스크롤 모달의 둥근 경계 밖으로 목록이 잘리지 않게 한다.
    setAvailableMenuHeight(Math.max(0, Math.min(menuMaxHeight, availableSpace - 6)));
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

  return {
    isOpen,
    dropUp,
    availableMenuHeight,
    containerRef,
    open,
    close,
    toggle,
  };
};
