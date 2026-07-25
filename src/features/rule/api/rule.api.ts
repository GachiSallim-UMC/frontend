import {
  ApiError,
  apiClient,
  withSelectedGroupParams,
  withSelectedNumericGroupBody,
} from '@/shared/api';
import type { RuleStatus } from '@/shared/types';
import { RULE_CATEGORY_BY_ID, RULE_CATEGORY_ID } from '../constants/rule.constants';
import type {
  CreateRuleDto,
  Rule,
  RuleAgreementApiStatus,
  RuleAgreementSummaryResponse,
  RuleApiStatus,
  RuleDetailResponse,
  RuleListItemResponse,
  ShareRuleResponse,
  UpdateRuleAgreementDto,
  UpdateRuleDto,
} from '../types/rule.types';

const BASE = '/rules';

const STATUS_FROM_API: Record<RuleApiStatus, RuleStatus> = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
};

const STATUS_TO_API: Record<RuleStatus, RuleApiStatus> = {
  active: 'ACTIVE',
  inactive: 'INACTIVE',
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isNullableString = (value: unknown): value is string | null =>
  value === null || typeof value === 'string';

const isRuleApiStatus = (value: unknown): value is RuleApiStatus =>
  value === 'ACTIVE' || value === 'INACTIVE';

const isAgreementStatus = (value: unknown): value is RuleAgreementApiStatus =>
  value === 'AGREED' || value === 'DISAGREED' || value === 'PENDING';

const isRuleUserResponse = (value: unknown): value is { userId: number; nickname: string } =>
  isRecord(value) &&
  typeof value.userId === 'number' &&
  Number.isSafeInteger(value.userId) &&
  typeof value.nickname === 'string';

const isAgreementSummary = (value: unknown): value is RuleAgreementSummaryResponse =>
  isRecord(value) &&
  typeof value.totalCount === 'number' &&
  typeof value.agreedCount === 'number' &&
  typeof value.disagreedCount === 'number' &&
  typeof value.pendingCount === 'number';

const isShareRuleResponse = (value: unknown): value is ShareRuleResponse =>
  isRecord(value) &&
  typeof value.ruleId === 'number' &&
  Number.isSafeInteger(value.ruleId) &&
  typeof value.messageId === 'number' &&
  Number.isSafeInteger(value.messageId);

const isRuleListItem = (value: unknown): value is RuleListItemResponse =>
  isRecord(value) &&
  typeof value.ruleId === 'number' &&
  Number.isSafeInteger(value.ruleId) &&
  typeof value.groupId === 'number' &&
  Number.isSafeInteger(value.groupId) &&
  (value.categoryId === null ||
    (typeof value.categoryId === 'number' && Number.isSafeInteger(value.categoryId))) &&
  typeof value.title === 'string' &&
  isNullableString(value.description) &&
  isRuleApiStatus(value.status) &&
  isRuleUserResponse(value.createdBy) &&
  isAgreementSummary(value.agreementSummary) &&
  typeof value.createdAt === 'string' &&
  typeof value.updatedAt === 'string';

const isRuleDetail = (value: unknown): value is RuleDetailResponse => {
  if (!isRuleListItem(value)) return false;
  const detail = value as unknown as Record<string, unknown>;

  return (
    isNullableString(detail.categoryName) &&
    (detail.myAgreementStatus === null || isAgreementStatus(detail.myAgreementStatus)) &&
    Array.isArray(detail.agreements) &&
    detail.agreements.every(
      agreement =>
        isRecord(agreement) &&
        typeof agreement.userId === 'number' &&
        Number.isSafeInteger(agreement.userId) &&
        typeof agreement.nickname === 'string' &&
        isAgreementStatus(agreement.status) &&
        isNullableString(agreement.confirmedAt),
    ) &&
    Array.isArray(detail.histories) &&
    detail.histories.every(
      history =>
        isRecord(history) &&
        typeof history.logId === 'number' &&
        Number.isSafeInteger(history.logId) &&
        typeof history.action === 'string' &&
        typeof history.message === 'string' &&
        typeof history.createdAt === 'string',
    )
  );
};

const toRule = (response: RuleListItemResponse | RuleDetailResponse): Rule => {
  const createdBy = {
    id: String(response.createdBy.userId),
    name: response.createdBy.nickname,
    nickname: response.createdBy.nickname,
  };
  const detail = 'agreements' in response ? response : null;
  const agreements = detail?.agreements.map(agreement => ({
    userId: String(agreement.userId),
    nickname: agreement.nickname,
    status: agreement.status,
    confirmedAt: agreement.confirmedAt,
  }));
  const agreedMembers =
    agreements
      ?.filter(agreement => agreement.status === 'AGREED')
      .map(agreement => ({
        id: agreement.userId,
        name: agreement.nickname,
        nickname: agreement.nickname,
      })) ?? [];

  return {
    id: String(response.ruleId),
    category:
      (response.categoryId === null ? undefined : RULE_CATEGORY_BY_ID.get(response.categoryId)) ??
      'etc',
    categoryId: response.categoryId,
    categoryName: detail?.categoryName ?? null,
    title: response.title,
    content: response.description ?? '',
    registeredBy: createdBy,
    registeredAt: response.createdAt,
    updatedAt: response.updatedAt,
    agreement: {
      ...response.agreementSummary,
      agreedMembers,
    },
    agreements,
    myAgreementStatus: detail?.myAgreementStatus,
    histories: detail?.histories.map(history => ({
      id: String(history.logId),
      action: history.action,
      message: history.message,
      createdAt: history.createdAt,
    })),
    status: STATUS_FROM_API[response.status],
  };
};

export const ruleApi = {
  getList: async (): Promise<Rule[]> => {
    const { data } = await apiClient.get<unknown>(BASE, {
      params: withSelectedGroupParams(),
    });

    if (!isRecord(data) || !Array.isArray(data.rules) || !data.rules.every(isRuleListItem)) {
      throw new ApiError(
        502,
        'INVALID_API_RESPONSE',
        '생활규칙 목록 응답 형식이 올바르지 않습니다.',
      );
    }

    return data.rules.map(toRule);
  },

  getDetail: async (id: string): Promise<Rule> => {
    const { data } = await apiClient.get<unknown>(`${BASE}/${id}`);
    if (!isRuleDetail(data)) {
      throw new ApiError(
        502,
        'INVALID_API_RESPONSE',
        '생활규칙 상세 응답 형식이 올바르지 않습니다.',
      );
    }
    return toRule(data);
  },

  create: async (dto: CreateRuleDto): Promise<{ ruleId: number; title: string }> => {
    const body = withSelectedNumericGroupBody({
      categoryId: RULE_CATEGORY_ID[dto.category],
      title: dto.title,
      description: dto.content,
    });
    const { data } = await apiClient.post<{ ruleId: number; title: string }>(BASE, body);
    return data;
  },

  update: async (id: string, dto: UpdateRuleDto): Promise<void> => {
    await apiClient.put(`${BASE}/${id}`, {
      categoryId: RULE_CATEGORY_ID[dto.category],
      title: dto.title,
      description: dto.content,
      status: STATUS_TO_API[dto.status],
    });
  },

  updateAgreement: async (id: string, dto: UpdateRuleAgreementDto): Promise<void> => {
    await apiClient.put(`${BASE}/${id}/agreements`, dto);
  },

  share: async (id: string): Promise<ShareRuleResponse> => {
    const { data } = await apiClient.post<unknown>(`${BASE}/${id}/share`);
    if (!isShareRuleResponse(data)) {
      throw new ApiError(
        502,
        'INVALID_API_RESPONSE',
        '생활규칙 메신저 공유 응답 형식이 올바르지 않습니다.',
      );
    }
    return data;
  },

  remove: async (id: string): Promise<void> => {
    await apiClient.delete(`${BASE}/${id}`);
  },
};
