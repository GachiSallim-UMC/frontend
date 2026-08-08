import { useState } from "react";
import { Button } from "@/shared/components"
import { downloadBlob } from "@/shared/lib";
import { useAlertStore } from "@/shared/store";
import { myPageApi } from "@/features/mypage/api/myPage.api";

interface DataInfoSettingsProps {
    onViewPrivacy?: () => void;
    onViewTerms?: () => void;
}

export const DataInfoSettings = ({ onViewPrivacy, onViewTerms }: DataInfoSettingsProps) => {
    const showAlert = useAlertStore((state) => state.showAlert);
    const [isExporting, setIsExporting] = useState(false);

    const handleExportData = async () => {
        try {
            setIsExporting(true);
            const { blob, filename } = await myPageApi.exportMyData();
            downloadBlob(blob, filename);
        } catch (error: unknown) {
            const e = error as Error & { response?: { data?: { message?: string } } };
            console.error('데이터 내보내기 실패:', e.response?.data?.message || e.message);
            showAlert({
                title: '내보내기 실패',
                message: '데이터를 내보내는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
            });
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <section className='flex w-full flex-col lg:rounded-2xl lg:bg-white lg:p-7'>
             <h3 className='mb-2 text-mobile-label font-bold text-gray-700 lg:mb-5 lg:text-lg lg:text-gray-900 lg:leading-snug'>
                데이터 및 정보
            </h3>

            <div className="flex flex-col divide-y divide-gray-100 rounded-lg border border-gray-100 bg-white lg:mt-5 lg:rounded-none lg:border-0 lg:border-t">
                        <div className="flex items-center justify-between px-4 py-2.5 lg:px-2 lg:py-4">
                            <div className='flex flex-col gap-0.5 lg:gap-1'>
                                <span className="text-mobile-label font-bold text-gray-700 lg:text-base lg:text-gray-900">
                                    내 데이터 내보내기
                                </span>
                                <span className='text-mobile-caption text-gray-700 lg:text-sm lg:text-gray-900'>
                                    집안일·정산·활동 내역을 파일(CSV)로 다운로드
                                </span>
                            </div>
                            <Button
                                variant="secondary"
                                size="sm"
                                isLoading={isExporting}
                                onClick={handleExportData}
                                className="h-5 px-2 text-mobile-caption lg:h-8 lg:px-3 lg:text-sm"
                            >
                                내보내기
                            </Button>
                        </div>

                        <div className="flex items-center justify-between px-4 py-2.5 lg:px-2 lg:py-4">
                            <div className='flex flex-col gap-0.5 lg:gap-1'>
                                <span className="text-mobile-label font-bold text-gray-700 lg:text-base lg:text-gray-900">
                                    개인정보 처리방침
                                </span>
                                <span className='hidden lg:block lg:text-sm lg:text-gray-900'>
                                    개인정보 수집·이용 및 보관 정책 안내
                                </span>
                            </div>
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={onViewPrivacy}
                                className="h-5 px-2 text-mobile-caption lg:h-8 lg:px-3 lg:text-sm"
                            >
                                보기
                            </Button>
                        </div>

                        <div className="flex items-center justify-between px-4 py-2.5 lg:px-2 lg:py-4">
                            <div className='flex flex-col gap-0.5 lg:gap-1'>
                                <span className="text-mobile-label font-bold text-gray-700 lg:text-base lg:text-gray-900">
                                    이용약관
                                </span>
                                <span className='hidden lg:block lg:text-sm lg:text-gray-900'>
                                    서비스 이용약관 전문
                                </span>
                            </div>
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={onViewTerms}
                                className="h-5 px-2 text-mobile-caption lg:h-8 lg:px-3 lg:text-sm"
                            >
                                보기
                            </Button>
                        </div>

                        <div className="flex items-center justify-between px-4 py-2.5 lg:px-2 lg:py-4">
                            <div className='flex flex-col gap-0.5 lg:gap-1'>
                                <span className="text-mobile-label font-bold text-gray-700 lg:text-base lg:text-gray-900">
                                    앱 버전
                                </span>
                                <span className='hidden lg:block lg:text-sm lg:text-gray-900'>
                                    같이살림 v.1.0.0·최신 버전
                                </span>
                            </div>
                            <span className='text-mobile-label text-gray-700 lg:text-sm lg:text-gray-900'>
                                v.1.0.0
                            </span>
                        </div>

                    </div>
        </section>
    );
};