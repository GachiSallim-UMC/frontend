import { PRIVACY_DATA } from "@/features/mypage/constants/Privacy"

export const PrivacyContent = () => {
    return (
        <div className="flex-1 overflow-y-auto px-4 py-4 lg:px-10 lg:py-7">
            <div className="mb-5 rounded-lg bg-primary-100 p-4 text-mobile-label font-medium leading-tight text-gray-600 lg:p-5 lg:text-sm">
                '같이살림'은 「개인정보 보호법」 등 관련 법령을 준수하며, 이용자의 개인정보를 안전하게 처리하기 위해 다음과 같은 처리방침을 두고 있습니다.
            </div>

            <div className="flex flex-col">
                {PRIVACY_DATA.map((section, index) => (
                    <div 
                        key={section.id}
                        className={`py-5 ${index !== PRIVACY_DATA.length - 1 ? "border-b border-gray-100" : "pb-0"}`}
                    >
                        <h3 className="mb-2 text-mobile-body font-bold text-gray-900 lg:text-base">
                            {section.title}
                        </h3>

                        {/* 일반 텍스트 */}
                        {section.content && (
                            <p className="break-keep-all text-mobile-label font-medium leading-snug text-gray-600 lg:text-sm">
                                {section.content}
                            </p>
                        )}

                        {/* 테이블 */}
                        {section.table && (
                            <div className="overflow-x-auto border border-gray-100">
                                <table className="w-full min-w-max text-left text-mobile-label lg:text-sm">
                                    <thead className="bg-primary-100 border-b border-gray-100 text-gray-900">
                                        <tr>
                                            {section.table.headers.map((header, i) => (
                                                <th key={i} className="whitespace-nowrap p-2 font-bold border-r border-gray-100 last:border-0 lg:p-3">
                                                    {header}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="text-gray-600 font-medium leading-relaxed">
                                        {section.table.rows.map((row, rowIndex) => (
                                            <tr key={rowIndex} className="border-b border-gray-100 last:border-0">
                                                {row.map((cell, cellIndex) => (
                                                    <td key={cellIndex} className="p-2 border-r border-gray-100 last:border-0 break-keep-all lg:p-3">
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
                            <ul className="list-disc list-inside break-keep-all text-mobile-label font-medium leading-snug text-gray-600 lg:text-sm">
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