import type { LegalDocumentSection } from '@/shared/constants/legal';

interface LegalDocumentContentProps {
  intro: string;
  sections: readonly LegalDocumentSection[];
  variant?: 'signup' | 'settings';
  showMobileEffectiveDate?: boolean;
}

export const LegalDocumentContent = ({
  intro,
  sections,
  variant = 'settings',
  showMobileEffectiveDate = false,
}: LegalDocumentContentProps) => {
  const isSignup = variant === 'signup';

  return (
    <div className={`flex-1 overflow-y-auto px-4 lg:px-10 lg:py-7 ${isSignup ? 'py-5' : 'py-4'}`}>
      {showMobileEffectiveDate && (
        <p className="mb-2 text-right text-mobile-caption font-medium text-gray-500 lg:hidden">
          시행일 2026.01.01
        </p>
      )}

      <div
        className={`rounded-lg bg-primary-100 p-4 text-mobile-label font-medium text-gray-600 lg:p-5 lg:text-sm ${
          isSignup
            ? 'mb-4 leading-relaxed lg:mb-5 lg:leading-tight'
            : 'mb-5 leading-tight'
        }`}
      >
        {intro}
      </div>

      <div className="flex flex-col">
        {sections.map((section, index) => (
          <section
            key={section.id}
            className={`${isSignup ? 'py-4 lg:py-5' : 'py-5'} ${
              index !== sections.length - 1 ? 'border-b border-gray-100' : 'pb-0'
            }`}
          >
            <h3
              className={`${isSignup ? 'mb-1.5' : 'mb-2'} text-mobile-body font-bold text-gray-900 lg:mb-2 lg:text-base`}
            >
              {section.title}
            </h3>

            {section.content && (
              <p
                className={`break-keep-all text-mobile-label font-medium text-gray-600 lg:text-sm ${
                  isSignup ? 'leading-relaxed lg:leading-snug' : 'leading-snug'
                }`}
              >
                {section.content}
              </p>
            )}

            {section.table && (
              <div
                className={`overflow-x-auto border border-gray-100 ${isSignup ? 'rounded-md' : ''}`}
              >
                <table
                  className={`w-full text-left ${
                    isSignup
                      ? 'min-w-[480px] text-mobile-caption lg:min-w-0 lg:text-sm'
                      : 'min-w-max text-mobile-label lg:text-sm'
                  }`}
                >
                  <thead className="border-b border-gray-100 bg-primary-100 text-gray-900">
                    <tr>
                      {section.table.headers.map(header => (
                        <th
                          key={header}
                          className={`border-r border-gray-100 p-2 font-bold last:border-0 lg:p-3 ${
                            isSignup ? '' : 'whitespace-nowrap'
                          }`}
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="font-medium leading-relaxed text-gray-600">
                    {section.table.rows.map((row, rowIndex) => (
                      <tr
                        key={`${section.id}-${rowIndex}`}
                        className="border-b border-gray-100 last:border-0"
                      >
                        {row.map((cell, cellIndex) => (
                          <td
                            key={`${section.id}-${rowIndex}-${cellIndex}`}
                            className="break-keep-all border-r border-gray-100 p-2 last:border-0 lg:p-3"
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {section.list && (
              <ol
                className={`list-inside list-decimal break-keep-all text-mobile-label font-medium text-gray-600 lg:text-sm ${
                  isSignup ? 'leading-relaxed lg:leading-snug' : 'leading-snug'
                }`}
              >
                {section.list.map((item, itemIndex) => (
                  <li key={`${section.id}-list-${itemIndex}`}>{item}</li>
                ))}
              </ol>
            )}

            {section.bullets && (
              <ul
                className={`list-inside list-disc break-keep-all text-mobile-label font-medium text-gray-600 lg:text-sm ${
                  isSignup ? 'leading-relaxed lg:leading-snug' : 'leading-snug'
                }`}
              >
                {section.bullets.map((item, itemIndex) => (
                  <li key={`${section.id}-bullet-${itemIndex}`}>{item}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    </div>
  );
};
