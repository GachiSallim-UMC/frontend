import { PRIVACY_DATA } from "@/features/auth/constants/Privacy"

export const PrivacyContent = () => {
    return (
        <div className="flex-1 overflow-y-auto px-4 py-5 lg:px-10 lg:py-7">
            <p className="mb-2 text-right text-mobile-caption font-medium text-gray-500 lg:hidden">
                시행일 2026.01.01
            </p>

            <div className="mb-4 rounded-lg bg-primary-100 p-4 text-mobile-label font-medium leading-relaxed text-gray-600 lg:mb-5 lg:p-5 lg:text-sm lg:leading-tight">
                '같이살림'은 「개인정보 보호법」 등 관련 법령을 준수하며, 이용자의 개인정보를 안전하게 처리하기 위해 다음과 같은 처리방침을 두고 있습니다.
            </div>

            <div className="flex flex-col">
                {PRIVACY_DATA.map((section, index) => (
                    <div
                        key={section.id}
                        className={`py-4 lg:py-5 ${index !== PRIVACY_DATA.length - 1 ? "border-b border-gray-100" : "pb-0"}`}
                    >
                        <h3 className="mb-1.5 text-mobile-body font-bold text-gray-900 lg:mb-2 lg:text-base">
                            {section.title}
                        </h3>

                        {/* 일반 텍스트 */}
                        {section.content && (
                            <p className="break-keep-all text-mobile-label font-medium leading-relaxed text-gray-600 lg:text-sm lg:leading-snug">
                                {section.content}
                            </p>
                        )}

                        {/* 테이블 */}
                        {section.table && (
                            <div className="overflow-x-auto rounded-md border border-gray-100">
                                <table className="w-full min-w-[480px] text-left text-mobile-caption lg:min-w-0 lg:text-sm">
                                    <thead className="bg-primary-100 border-b border-gray-100 text-gray-900">
                                        <tr>
                                            {section.table.headers.map((header, i) => (
                                                <th key={i} className="border-r border-gray-100 p-2 font-bold last:border-0 lg:p-3">
                                                    {header}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="text-gray-600 font-medium leading-relaxed">
                                        {section.table.rows.map((row, rowIndex) => (
                                            <tr key={rowIndex} className="border-b border-gray-100 last:border-0">
                                                {row.map((cell, cellIndex) => (
                                                    <td key={cellIndex} className="break-keep-all border-r border-gray-100 p-2 last:border-0 lg:p-3">
                                                        {cell}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* 리스트 */}
                        {section.bullets && (
                            <ul className="list-disc list-inside break-keep-all text-mobile-label font-medium leading-relaxed text-gray-600 lg:text-sm lg:leading-snug">
                                {section.bullets.map((item, i) => (
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
    )
}