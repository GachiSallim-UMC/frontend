import { useState } from 'react';
import { SelectDropdown } from '@/shared/components';
import { Switch } from '@/shared/components';
import { useAutoLoginStore, useDateFormatStore, useStartDayStore } from '@/shared/store';
import {
  DATE_FORMAT_OPTIONS,
  FONT_SIZE_OPTIONS,
  LANGUAGE_OPTIONS,
  START_DAY_OPTIONS,
  THEME_OPTIONS,
  TIMEZONE_OPTIONS,
} from '@/features/mypage/types/mypage.constants'
import type {
  FontSizeValue,
  LanguageValue,
  ThemeValue,
  TimezoneValue,
} from '@/features/mypage/types/mypage.types'

export const SystemSetting = () => {
    // 드롭다운 상태 관리
    const [theme, setTheme] = useState<ThemeValue>('light');
    const [language, setLanguage] = useState<LanguageValue>('ko');
    const [timezone, setTimezone] = useState<TimezoneValue>('seoul');
    // 주 시작 요일은 전역 설정이라 집안일 페이지 주간 캘린더에도 반영되도록 전역 store 사용
    const startDay = useStartDayStore(state => state.startDay);
    const setStartDay = useStartDayStore(state => state.setStartDay);
    // 날짜 형식은 전역 설정이라 다른 화면의 날짜 표시에도 즉시 반영되도록 전역 store를 사용
    const dateFormat = useDateFormatStore(state => state.dateFormat);
    const setDateFormat = useDateFormatStore(state => state.setDateFormat);
    const [fontSize, setFontSize] = useState<FontSizeValue>('normal');

    // 토글 스위치 상태 관리
  // 꺼져 있으면 세션이 sessionStorage에 저장되어 탭·브라우저를 닫으면 로그아웃됨
  const autoLogin = useAutoLoginStore(state => state.autoLogin);
  const setAutoLogin = useAutoLoginStore(state => state.setAutoLogin);
  // 알림 소리·진동은 기기 로컬 설정이라 전역 store 없이 이 화면에서만 관리
  const [soundVibration, setSoundVibration] = useState(true);

  // w-auto인 트리거에 최소 폭을 주지 않으면, 열린 메뉴 폭이 현재 선택값 길이에 맞춰져
  // 더 긴 옵션 텍스트가 잘려 보인다. 선택된 항목엔 체크 아이콘(16px)까지 붙으므로
  // "YYYY/MM/DD" 같은 긴 라벨 + 체크 아이콘이 다 들어갈 만큼 넉넉히 잡는다.
  // justify-end로 텍스트·화살표는 트리거 오른쪽에 붙여 정렬한다.
  const mobileRowTriggerClassName =
    'h-auto min-w-[150px] w-auto justify-end gap-1 border-none bg-transparent p-0 text-mobile-label text-gray-500 hover:bg-transparent focus:ring-0';

  return (
    <section className='flex w-full flex-col lg:rounded-2xl lg:bg-white lg:p-7'>
        <h3 className='mb-2 text-mobile-label font-bold text-gray-700 lg:mb-5 lg:text-lg lg:text-gray-900 lg:leading-snug'>
                시스템 설정
        </h3>

        {/* 모바일: 행 목록 */}
        <div className="flex flex-col divide-y divide-gray-100 rounded-lg border border-gray-100 bg-white lg:hidden">
            <div className="flex items-center justify-between px-4 py-2.5">
                <span className="text-mobile-label font-bold text-gray-700">테마</span>
                <SelectDropdown options={THEME_OPTIONS} value={theme} onChange={setTheme} containerClassName="w-auto" className={mobileRowTriggerClassName} />
            </div>
            <div className="flex items-center justify-between px-4 py-2.5">
                <span className="text-mobile-label font-bold text-gray-700">언어</span>
                <SelectDropdown options={LANGUAGE_OPTIONS} value={language} onChange={setLanguage} containerClassName="w-auto" className={mobileRowTriggerClassName} />
            </div>
            <div className="flex items-center justify-between px-4 py-2.5">
                <span className="text-mobile-label font-bold text-gray-700">날짜 형식</span>
                <SelectDropdown options={DATE_FORMAT_OPTIONS} value={dateFormat} onChange={setDateFormat} containerClassName="w-auto" className={mobileRowTriggerClassName} />
            </div>
            <div className="flex items-center justify-between px-4 py-2.5">
                <span className="text-mobile-label font-bold text-gray-700">글자 크기</span>
                <SelectDropdown options={FONT_SIZE_OPTIONS} value={fontSize} onChange={setFontSize} containerClassName="w-auto" className={mobileRowTriggerClassName} />
            </div>
            <div className="flex items-center justify-between px-4 py-2.5">
                <span className="text-mobile-label font-bold text-gray-700">시간대</span>
                <SelectDropdown options={TIMEZONE_OPTIONS} value={timezone} onChange={setTimezone} containerClassName="w-auto" className={mobileRowTriggerClassName} />
            </div>
            <div className="flex items-center justify-between px-4 py-2.5">
                <span className="text-mobile-label font-bold text-gray-700">주 시작 요일</span>
                <SelectDropdown options={START_DAY_OPTIONS} value={startDay} onChange={setStartDay} containerClassName="w-auto" className={mobileRowTriggerClassName} />
            </div>
            <div className="flex items-center justify-between px-4 py-2.5">
                <span className="text-mobile-label font-bold text-gray-700">자동 로그인 유지</span>
                <Switch checked={autoLogin} onChange={setAutoLogin} />
            </div>
            <div className="flex items-center justify-between px-4 py-2.5">
                <span className="text-mobile-label font-bold text-gray-700">알림 소리 · 진동</span>
                <Switch checked={soundVibration} onChange={setSoundVibration} />
            </div>
        </div>

        {/* 데스크톱: 드롭다운 그리드 */}
        <div className="hidden grid-cols-2 gap-x-12 gap-y-6 lg:grid">
            <SelectDropdown label="테마" options={THEME_OPTIONS} value={theme} onChange={setTheme} />
            <SelectDropdown label="언어" options={LANGUAGE_OPTIONS} value={language} onChange={setLanguage} />
            <SelectDropdown label="시간대" options={TIMEZONE_OPTIONS} value={timezone} onChange={setTimezone} />
            <SelectDropdown label="주 시작 요일" options={START_DAY_OPTIONS} value={startDay} onChange={setStartDay} />
            <SelectDropdown label="날짜 형식" options={DATE_FORMAT_OPTIONS} value={dateFormat} onChange={setDateFormat} />
            <SelectDropdown label="글자 크기" options={FONT_SIZE_OPTIONS} value={fontSize} onChange={setFontSize} />
        </div>

        {/* 데스크톱: 하단 토글 설정 영역 */}
        <div className="hidden lg:mt-5 lg:flex lg:flex-col lg:divide-y lg:divide-gray-100 lg:border-t lg:border-gray-100">
            <div className="flex items-center justify-between px-2 py-4">
                <div className='flex flex-col gap-1'>
                    <span className="text-base font-bold text-gray-900">
                        자동 로그인 유지
                    </span>
                    <span className='text-sm text-gray-900'>
                        이 기기에서 로그인 상태를 유지합니다.
                    </span>
                </div>
                <Switch checked={autoLogin} onChange={setAutoLogin} />
            </div>

        </div>
    </section>
  )
}
