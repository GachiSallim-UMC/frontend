import type { Config } from 'tailwindcss';

/**
 * 색상 토큰은 Figma 디자인 시스템(1. 디자인 시스템 > Color)에서 직접 추출한 값입니다.
 * 임의의 Tailwind 기본 색상을 쓰지 말고 반드시 이 토큰을 사용하세요.
 */
const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Figma: Blue (primary)
        primary: {
          50: '#F8FAFC',
          100: '#F2F9FF',
          200: '#E5F1FD',
          300: '#93C9FF',
          400: '#64A7FF',
          500: '#358CFF',
          600: '#307CF6',
          700: '#1B6CEE',
          DEFAULT: '#307CF6',
        },
        // Figma: Green
        green: {
          100: '#F1FFF3',
          300: '#CDEFD1',
          500: '#94E89E',
          700: '#008F62',
        },
        // Figma: Orange (미정산/부족 등 경고 계열 — 실제 톤은 옐로우에 가까움)
        orange: {
          100: '#FFF8D7',
          300: '#FFD964',
          500: '#FFC000',
          700: '#FF9E00',
        },
        // Figma: Red
        red: {
          100: '#F9DADA',
          300: '#FFC5C5',
          500: '#FF7978',
          700: '#EF4452',
        },
        // Figma: Purple
        purple: {
          100: '#F4ECFF',
          300: '#E7D5FF',
          500: '#B984FF',
          700: '#9747FF',
        },
        // Figma: Gray
        gray: {
          100: '#EEEEEE',
          200: '#D9D9D9',
          400: '#C4C4C4',
          500: '#888888',
          600: '#666666',
          700: '#444444',
          800: '#222222',
          900: '#111111',
        },
      },
      fontFamily: {
        sans: [
          'Pretendard',
          '-apple-system',
          'BlinkMacSystemFont',
          'system-ui',
          'sans-serif',
        ],
        // 로고 제목 전용 (Figma: KBO Dia Gothic)
        logo: ['"KBO Dia Gothic"', 'Pretendard', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 4px 0 rgba(0,0,0,0.08)',
        dropdown: '0 4px 16px 0 rgba(0,0,0,0.12)',
      },
      // Figma 디자인시스템 Font 섹션의 역할별 타이포 크기 체계
      fontSize: {
        caption: ['14px', '1.5'], // 보조설명·멤버수·날짜·담당자·배지
        button: ['16px', '1.5'], // 사용자명·주요 버튼·프로필명
        body: ['18px', '1.45'], // 사이드바 메뉴·본문·섹션제목·리스트제목
        'group-title': ['20px', '1.4'], // 그룹명·상단 주요 정보
        'key-number': ['24px', '1.3'], // 대시보드 핵심 숫자·금액·카운트
      },
    },
  },
  plugins: [],
};

export default config;
