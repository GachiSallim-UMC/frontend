/** `Record<값, 라벨>` 맵을 SelectDropdown/필터용 { value, label } 배열로 변환 */
export const toSelectOptions = <T extends string>(labelMap: Record<T, string>) =>
  (Object.keys(labelMap) as T[]).map(value => ({ value, label: labelMap[value] }));
