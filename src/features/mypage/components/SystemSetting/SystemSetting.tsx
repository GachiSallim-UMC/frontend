import { useState } from 'react';
import { SelectDropdown } from '@/shared/components';
import { Switch } from '@/shared/components';
import { useStartDayStore } from '@/shared/store';
import { useDateFormatStore } from '@/shared/store';
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
    const [dateFormat, setDateFormat] = useState<DateFormatValue>('YYYY/MM/DD');
    const [fontSize, setFontSize] = useState<FontSizeValue>('normal');

    // 토글 스위치 상태 관리
  const [autoLogin, setAutoLogin] = useState<boolean>(true);
  const [soundVibration, setSoundVibration] = useState<boolean>(true);
  const [dataSaver, setDataSaver] = useState<boolean>(false);

  return (
    <section className='flex w-full flex-col rounded-2xl bg-white p-7'>
        <h3 className='mb-5 text-lg font-bold text-gray-900 leading-snug'>
                시스템 설정
        </h3>

        {/* 드롭다운 */}
        <div className="grid grid-cols-2 gap-x-12 gap-y-6">
            <SelectDropdown label="테마" options={THEME_OPTIONS} value={theme} onChange={setTheme} />
            <SelectDropdown label="언어" options={LANGUAGE_OPTIONS} value={language} onChange={setLanguage} />
            <SelectDropdown label="시간대" options={TIMEZONE_OPTIONS} value={timezone} onChange={setTimezone} />
            <SelectDropdown label="주 시작 요일" options={START_DAY_OPTIONS} value={startDay} onChange={setStartDay} />
            <SelectDropdown label="날짜 형식" options={DATE_FORMAT_OPTIONS} value={dateFormat} onChange={setDateFormat} />
            <SelectDropdown label="글자 크기" options={FONT_SIZE_OPTIONS} value={fontSize} onChange={setFontSize} />
        </div>

        {/* 하단 토글 설정 영역 */}
        <div className="mt-5 flex flex-col divide-y divide-gray-100 border-t border-gray-100">
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

            <div className="flex items-center justify-between px-2 py-4">
                <div className='flex flex-col gap-1'>
                    <span className="text-base font-bold text-gray-900">
                        알림 소리 · 진동 
                    </span>
                    <span className='text-sm text-gray-900'>
                        새 알림 도착 시 소리와 진동으로 안내합니다.
                    </span>
                </div>
                <Switch checked={soundVibration} onChange={setSoundVibration} />
            </div>

            <div className="flex items-center justify-between px-2 py-4">
                <div className='flex flex-col gap-1'>
                    <span className="text-base font-bold text-gray-900">
                        데이터 절약 모드
                    </span>
                    <span className='text-sm text-gray-900'>
                        이미지·프로필 사진을 저화질로 불러옵니다.
                    </span>
                </div>
                <Switch checked={dataSaver} onChange={setDataSaver} />
            </div>

        </div>
    </section>
  )
}