import { Link } from 'react-router-dom';
import EditIcon from '@/assets/icons/action/edit.svg?react';
import ShareIcon from '@/assets/icons/action/share.svg?react';
import { StatusBadge } from '@/shared/components/ui';
import { RULE_CATEGORY_LABEL } from '../hooks/useRuleFilters';
import type { Rule } from '../types/rule.types';

interface RuleListRowProps {
  rule: Rule;
  isLast: boolean;
}

/** 생활 규칙 목록의 한 행 — Figma 시안대로 헤더 없는 리스트 형태 (표가 아님) */
export const RuleListRow = ({ rule, isLast }: RuleListRowProps) => {
  const { agreedCount, totalCount } = rule.agreement;
  const agreementText =
    agreedCount === totalCount
      ? `전원(${totalCount}/${totalCount})`
      : `${agreedCount}/${totalCount}`;

  return (
    <div
      className={`relative ${
        isLast
          ? 'h-[84px]'
          : 'h-[86px] after:absolute after:bottom-0 after:left-[27px] after:right-[29px] after:h-px after:bg-gray-100'
      }`}
    >
      <div className="flex h-[84px] items-center pl-[34px] pr-[25px]">
        <div className="flex w-[99px] shrink-0 items-center gap-3">
          <span className="h-[30px] w-1 shrink-0 rounded-full bg-primary-500" />
          <span className="truncate text-body font-bold text-primary-700">
            {RULE_CATEGORY_LABEL[rule.category]}
          </span>
        </div>

        <Link to={`/rules/${rule.id}`} className="ml-5 min-w-0 flex-1">
          <p className="truncate text-button font-bold leading-normal text-gray-900">
            {rule.title}
          </p>
          <p className="mt-1 truncate text-caption leading-normal text-gray-600">
            등록: {rule.registeredBy.name} | {rule.registeredAt} | 동의: {agreementText}
            {rule.status === 'inactive' && ' — 논의 중'}
          </p>
        </Link>

        <StatusBadge variant={rule.status} className="w-[68px] shrink-0 px-0 leading-normal" />

        <span className="ml-[30px] flex w-[78px] shrink-0 items-center text-gray-500">
          <Link
            to={`/rules/${rule.id}`}
            aria-label="수정"
            className="flex size-[39px] items-center justify-center hover:text-primary-600"
          >
            <EditIcon className="size-[39px]" />
          </Link>
          <button
            type="button"
            aria-label="공유"
            className="flex size-[39px] items-center justify-center hover:text-primary-600"
          >
            <ShareIcon className="size-[39px]" />
          </button>
        </span>
      </div>
    </div>
  );
};
