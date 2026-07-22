import { apiClient } from '@/shared/api';
import type { Chore, ChoreFilter, CreateChoreDto, UpdateChoreDto } from '../types/chore.types';

const BASE = '/chores';

export const choreApi = {
  /** 집안일 목록 조회 */
  getList: async (filter?: ChoreFilter): Promise<Chore[]> => {
    const { data } = await apiClient.get<Chore[]>(BASE, { params: filter });
    // 백엔드 미연결/비정상 응답 시에도 항상 배열을 보장
    return Array.isArray(data) ? data : [];
  },

  /** 집안일 단건 조회 */
  getDetail: async (id: string): Promise<Chore> => {
    const { data } = await apiClient.get<Chore>(`${BASE}/${id}`);
    return data;
  },

  /** 집안일 등록 */
  create: async (dto: CreateChoreDto): Promise<Chore> => {
    const { data } = await apiClient.post<Chore>(BASE, dto);
    return data;
  },

  /** 집안일 수정 */
  update: async (id: string, dto: UpdateChoreDto): Promise<Chore> => {
    const { data } = await apiClient.patch<Chore>(`${BASE}/${id}`, dto);
    return data;
  },

  /** 집안일 삭제 */
  remove: async (id: string): Promise<void> => {
    await apiClient.delete(`${BASE}/${id}`);
  },
};
