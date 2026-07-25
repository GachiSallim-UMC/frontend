import { apiClient } from '@/shared/api';
import type { ApiResponse } from '@/shared/types';
import type { Chore, CreateChoreDto, GetChoresParams, UpdateChoreDto } from '../types/chore.types';

const BASE = '/chores';

export const choreApi = {
  /** 집안일 목록 조회 */
  getList: async (params: GetChoresParams): Promise<Chore[]> => {
    const { data } = await apiClient.get<ApiResponse<Chore[]>>(BASE, { params });
    // 백엔드 미연결/비정상 응답 시에도 항상 배열을 보장
    const resultList = data?.data ?? data;
    return Array.isArray(resultList) ? resultList : [];
  },

  /** 집안일 단건 조회 */
  getDetail: async (id: string): Promise<Chore> => {
    const { data } = await apiClient.get<Chore>(`${BASE}/${id}`);
    return ('data' in data ? data.data : data) as Chore;
  },

  /** 집안일 등록 */
  create: async (dto: CreateChoreDto): Promise<Chore> => {
    const { data } = await apiClient.post<Chore>(BASE, dto);
    return ('data' in data ? data.data : data) as Chore;
  },

  /** 집안일 수정 */
  update: async (id: string, dto: UpdateChoreDto): Promise<Chore> => {
    const { data } = await apiClient.put<ApiResponse<Chore>>(`${BASE}/${id}`, dto);
    return ('data' in data ? data.data : data) as Chore;
  },

  /** 집안일 삭제 */
  remove: async (id: string): Promise<void> => {
    await apiClient.delete(`${BASE}/${id}`);
  },

  /** 집안일 완료 */
  complete: async (id: string): Promise<Chore> => {
    const { data } = await apiClient.patch<ApiResponse<Chore>>(`${BASE}/${id}/complete`);
    return ('data' in data ? data.data : data) as Chore;
  },

  /** 집안일 메신저 공유 */
  share: async (id: string) => {
    const { data } = await apiClient.post<
      ApiResponse<{
        choreId: number;
        chatMessageId: number;
        shareCard: any;
        sentAt: string;
      }>
    >(`${BASE}/${id}/share`);

    return data.data;
  },
};
