import { useParams } from 'react-router-dom';
import { ItemFormPage } from '@/pages/item/ItemFormPage';

/** :id가 바뀌어도 동일 라우트라 컴포넌트가 재사용되며 useState 초기값이 stale해지는 문제를
 *  막기 위해, id를 key로 넘겨 파라미터 변경 시 강제로 리마운트시킨다. */
export const ItemEditRoute = () => {
  const { id } = useParams();
  return <ItemFormPage key={id} />;
};
