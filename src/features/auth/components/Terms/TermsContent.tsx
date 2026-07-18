import { TERMS_DATA } from "@/features/auth/constants/Terms";

export const TermsContent = () => {
    return (
        <div className="flex-1 overflow-y-auto py-7 px-10">
            <div className="mb-5 rounded-lg bg-primary-100 p-5 text-sm text-gray-600 font-medium leading-tight">
                본 약관은 '같이살림'(이하 "회사")이 제공하는 공동생활 운영 서비스의 이용과 관련하여 회사와 회원 간의 권리·의무 및 책임사항을 규정합니다.
            </div>

            <div className="flex flex-col">
                {TERMS_DATA.map((term, index) => (
                    <div 
                        key={term.id}
                        className={`py-5 ${index !== TERMS_DATA.length - 1 ? "border-b border-gray-100" : "pb-0"}`}
                    >
                        <h3 className="mb-2 text-base font-bold text-gray-900">
                            {term.title}
                        </h3>

                        {term.content && (
                            <p className="break-keep-all text-gray-600 text-sm font-medium leading-snug">
                                {term.content}
                            </p>
                        )}

                        {term.list && (
                            <ol className="list-decimal break-keep-all text-sm leading-snug font-medium text-gray-600">
                                {term.list.map((item, i) => (
                                    <li key={i}>
                                        {item}
                                    </li>
                                ))}
                            </ol>
                        )}

                        {term.bullets && (
                            <ul className="list-disc break-keep-all leading-snug font-medium text-sm text-gray-600">
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