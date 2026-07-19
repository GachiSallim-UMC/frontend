import { Button } from "@/shared/components"

export const DataInfoSettings = () => {
    return (
        <section className='flex w-full flex-col rounded-2xl bg-white p-7'>
             <h3 className='mb-5 text-lg font-bold text-gray-900 leading-snug'>
                데이터 및 정보
            </h3>

            <div className="mt-5 flex flex-col divide-y divide-gray-100 border-t border-gray-100">
                        <div className="flex items-center justify-between px-2 py-4">
                            <div className='flex flex-col gap-1'>
                                <span className="text-base font-bold text-gray-900">
                                    내 데이터 내보내기
                                </span>
                                <span className='text-sm text-gray-900'>
                                    집안일·정산·활동 내역을 파일(CSV)로 다운로드 
                                </span>
                            </div>
                            <Button 
                                variant="secondary"
                                size="sm"
                            > 
                                내보내기 
                            </Button>
                        </div>
            
                        <div className="flex items-center justify-between px-2 py-4">
                            <div className='flex flex-col gap-1'>
                                <span className="text-base font-bold text-gray-900">
                                    캐시 삭제
                                </span>
                                <span className='text-sm text-gray-900'>
                                    임시 저장 데이터를 정리합니다(현재 12.4MB)
                                </span>
                            </div>
                            <Button 
                                variant="secondary"
                                size="sm"
                            > 
                                삭제 
                            </Button>
                        </div>
            
                        <div className="flex items-center justify-between px-2 py-4">
                            <div className='flex flex-col gap-1'>
                                <span className="text-base font-bold text-gray-900">
                                    개인정보 처리방침
                                </span>
                                <span className='text-sm text-gray-900'>
                                    개인정보 수집·이용 및 보관 정책 안내
                                </span>
                            </div>
                            <Button 
                                variant="secondary"
                                size="sm"
                            > 
                                보기
                            </Button>
                        </div>

                        <div className="flex items-center justify-between px-2 py-4">
                            <div className='flex flex-col gap-1'>
                                <span className="text-base font-bold text-gray-900">
                                    이용약관
                                </span>
                                <span className='text-sm text-gray-900'>
                                    서비스 이용약관 전문
                                </span>
                            </div>
                            <Button 
                                variant="secondary"
                                size="sm"
                            > 
                                보기
                            </Button>
                        </div>

                        <div className="flex items-center justify-between px-2 py-4">
                            <div className='flex flex-col gap-1'>
                                <span className="text-base font-bold text-gray-900">
                                    앱 버전
                                </span>
                                <span className='text-sm text-gray-900'>
                                    같이살림 v.1.0.0·최신 버전
                                </span>
                            </div>
                            <span className='text-sm text-gray-900'>
                                v.1.0.0
                            </span>
                        </div>
            
                    </div>
        </section>
    );
};