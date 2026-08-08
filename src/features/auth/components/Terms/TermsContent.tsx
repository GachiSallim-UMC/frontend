import { TERMS_DATA } from "@/features/auth/constants/Terms";

export const TermsContent = () => {
    return (
        <div className="flex-1 overflow-y-auto px-4 py-5 lg:px-10 lg:py-7">
            <p className="mb-2 text-right text-mobile-caption font-medium text-gray-500 lg:hidden">
                시행일 2026.01.01
            </p>

            <div className="mb-4 rounded-lg bg-primary-100 p-4 text-mobile-label font-medium leading-relaxed text-gray-600 lg:mb-5 lg:p-5 lg:text-sm lg:leading-tight">
                본 약관은 '같이살림'(이하 "회사")이 제공하는 공동생활 운영 서비스의 이용과 관련하여 회사와 회원 간의 권리·의무 및 책임사항을 규정합니다.
            </div>

            <div className="flex flex-col">
                {TERMS_DATA.map((term, index) => (
                    <div
                        key={term.id}
                        className={`py-4 lg:py-5 ${index !== TERMS_DATA.length - 1 ? "border-b border-gray-100" : "pb-0"}`}
                    >
                        <h3 className="mb-1.5 text-mobile-body font-bold text-gray-900 lg:mb-2 lg:text-base">
                            {term.title}
                        </h3>

                        {/* 일반 텍스트 */}
                        {term.content && (
                            <p className="break-keep-all text-mobile-label font-medium leading-relaxed text-gray-600 lg:text-sm lg:leading-snug">
                                {term.content}
                            </p>
                        )}

                        {term.list && (
                            <ol className="list-decimal list-inside break-keep-all text-mobile-label font-medium leading-relaxed text-gray-600 lg:text-sm lg:leading-snug">
                                {term.list.map((item, i) => (
                                    <li key={i}>
                                        {item}
                                    </li>
                                ))}
                            </ol>
                        )}

                        {term.bullets && (
                            <ul className="list-disc list-inside break-keep-all text-mobile-label font-medium leading-relaxed text-gray-600 lg:text-sm lg:leading-snug">
                                {term.bullets.map((item, i) => (
                                    <li key={i}>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};