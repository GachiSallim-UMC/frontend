import { Link } from 'react-router-dom';
import EditIcon from '@/assets/icons/action/edit.svg?react';
import ShareIcon from '@/assets/icons/action/share.svg?react';
import { StatusBadge } from '@/shared/components/ui';
import { cn } from '@/shared/lib/cn';
import { RULE_CATEGORY_LABEL } from '../constants/rule.constants';
import type { Rule } from '../types/rule.types';

interface RuleListRowProps {
  rule: Rule;
  isLast: boolean;
  onShare: (id: string) => void;
}

/** 생활 규칙 목록의 한 행 — Figma 시안대로 헤더 없는 리스트 형태 (표가 아님) */
export const RuleListRow = ({ rule, isLast, onShare }: RuleListRowProps) => {
  const { agreedCount, totalCount } = rule.agreement;
  const agreementText =
    agreedCount === totalCount
      ? `전원(${totalCount}/${totalCount})`
      : `${agreedCount}/${totalCount}`;

  return (
    <div
      className={cn(
        'relative h-[69px] sm:h-[61px] lg:h-[84px]',
        !isLast &&
          'after:absolute after:bottom-0 after:left-4 after:right-4 after:h-px after:bg-gray-100 lg:h-[85px] lg:after:left-[27px] lg:after:right-[29px]',
      )}
    >
      <div className="flex h-[68px] items-center pl-3 pr-1.5 sm:h-[60px] sm:pl-4 sm:pr-2 lg:h-[84px] lg:pl-[34px] lg:pr-[25px]">
        <div className="flex w-[68px] shrink-0 items-center gap-1.5 sm:w-[84px] sm:gap-2 lg:w-[99px] lg:gap-3">
          <span className="h-5 w-0.5 shrink-0 rounded-full bg-primary-500 lg:h-[30px] lg:w-1" />
          <span className="whitespace-nowrap text-mobile-label font-bold text-primary-700 lg:text-body">
            {RULE_CATEGORY_LABEL[rule.category]}
          </span>
        </div>

        <Link to={`/rules/${rule.id}`} className="ml-2 min-w-0 flex-1 sm:ml-3 lg:ml-5">
          <p className="line-clamp-2 text-mobile-label font-bold leading-normal text-gray-900 sm:line-clamp-1 lg:text-button">
            {rule.title}
          </p>
          <p className="mt-0.5 truncate text-mobile-caption leading-normal text-gray-600 lg:mt-1 lg:text-caption">
            <span className="lg:hidden">
              동의 {agreedCount}/{totalCount} ㅣ {rule.registeredBy.name} 등록
            </span>
            <span className="hidden lg:inline">
              등록: {rule.registeredBy.name} | {rule.registeredAt} | 동의: {agreementText}
              {rule.status === 'inactive' && ' — 논의 중'}
            </span>
          </p>
        </Link>

        <StatusBadge
          variant={rule.status}
          className="ml-2 h-[26px] w-[50px] shrink-0 px-0 text-mobile-caption leading-normal sm:w-[52px] lg:ml-0 lg:h-[34px] lg:w-[68px] lg:text-caption"
        />

        <span className="ml-1.5 flex w-12 shrink-0 items-center text-gray-400 sm:ml-2 sm:w-14 lg:ml-[30px] lg:w-[78px]">
          <Link
            to={`/rules/${rule.id}`}
            aria-label="수정"
            className="flex size-6 items-center justify-center transition-colors hover:text-gray-500 sm:size-7 lg:size-[39px]"
          >
            <EditIcon className="size-6 sm:size-7 lg:size-[39px]" />
          </Link>
          <button
            type="button"
            aria-label="공유"
            onClick={() => onShare(rule.id)}
            className="flex size-6 items-center justify-center transition-colors hover:text-gray-500 sm:size-7 lg:size-[39px]"
          >
            <ShareIcon className="size-6 sm:size-7 lg:size-[39px]" />
          </button>
        </span>
      </div>
    </div>
  );
};
